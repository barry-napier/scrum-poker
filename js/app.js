var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var config  = require('./config/');
var router  = require('./router/')(app);
var db      = require('./database/');
var logger  = config.logger;
var io      = require('socket.io')(server);

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

var clients = {};
var games   = {};

var remove = function (arr, what) {
  var found = arr.indexOf(what);

  while (found !== -1) {
    arr.splice(found, 1);
    found = arr.indexOf(what);
  }
}

var createGame = function (gameId) {

  var game = games[gameId] = {};

  game.id                = gameId;
  game.started           = false;
  game.players           = {};
  game.stories           = {};
  game.currentStory      = "";
  game.currentStoryIndex = 0;
  game.numOfPlayers = 0;


  return game;
};

var getGame = function (gameId) {

  var game = games[gameId];

  if (!game) {

    return createGame(gameId);

  }

  return game;
};

io.on('connection', function (socket) {

  clients[socket.id] = socket;

  /**
   * Join function will create a game and add users to game.
   */
  socket.on('join', function (data) {

    var gameId     = data.gameId;
    var playerName = data.playerName;

    socket.join(gameId);

    console.log('Game Id: '  + gameId);
    console.log('playerName: ' + playerName);

    socket.gameId     = gameId;
    socket.playerName = playerName;

    console.log('Socket playerName: ' + socket.playerName);

    var player = getGame(gameId).players[playerName];

    if (!player) {

      getGame(gameId).numOfPlayers++;
      getGame(gameId).players[playerName] = { playerName:playerName, voted: false, score:0, socketId: socket.id };

    }

    console.log('Number of Users: ' + getGame(gameId).numOfPlayers);
    console.log('Players: ' + getGame(gameId).players);

    io.to(gameId).emit('user joined', {game: getGame(gameId), playerName: playerName});

  });

  /**
   * when the user disconnects.
   */
  socket.on('disconnect', function () {

    var gameId = socket.gameId;

  });

  /**
   * Update the game.
   */
  socket.on('update game', function (data) {

    var gameId    = data.gameId;
    games[gameId] = data.game;

    io.to(gameId).emit('game updated', {game: games[gameId]});

  });

  /**
   * Start the game.
   */
  socket.on('start game', function () {

    getGame(socket.gameId).started = true;
    io.to(socket.gameId).emit('game started', {game: games[socket.gameId]});

  });

  socket.on('kick player', function (data) {

    var userIdToBeKicked = data.socketId

    socket.clients[userIdToBeKicked].onDisconnect();

  });

});

module.exports = app;
