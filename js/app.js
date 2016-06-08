var express = require('express');
var app     = express();
var server  = require('http').createServer(app);
var config  = require('./config/');
var router  = require('./router/')(app);
var db      = require('./database/');
var logger  = config.logger;
var io      = require('socket.io')(server);
var game    = require('./game');

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

  game.id           = gameId;
  game.started      = false;
  game.players      = {};
  game.stories      = {};
  game.currentStory = "CCDS-221";

  game.stories["CCDS-221"] = {
    name        : 'CCDS-221',
    description : 'Keyboard Shortcuts',
    value       : '',
    link        : 'https://jira-oracom.us.oracle.com/jira/browse/CCDS-221',
    votes       : []
  };

  game.stories["CCDS-2246"] = {
    name        : 'CCDS-2246',
    description : 'Associate Layouts with B2B',
    value       : '',
    link        :'https://jira-oracom.us.oracle.com/jira/browse/CCDS-2246',
    votes       : []
  };

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

    socket.playerName = playerName;
    socket.gameId   = gameId;

    console.log('Socket playerName: ' + socket.playerName);

    getGame(gameId).numOfPlayers++;
    getGame(gameId).players[playerName] = { playerName:playerName, voted: false, score:0, socketId: socket.id };

    console.log('Number of Users: ' + getGame(gameId).numOfPlayers);
    console.log('Players: ' + getGame(gameId).players);

    io.to(gameId).emit('user joined', {game: getGame(gameId), playerName: playerName});

  });

  /**
   * when the user disconnects.
   */
  socket.on('disconnect', function () {

    getGame(socket.gameId).numOfPlayers--;
    delete getGame(socket.gameId).players[socket.playerName];

    console.log('Username disconnected: ' + socket.playerName);
    console.log('Number of Users: ' + getGame(socket.gameId).numOfPlayers);

    io.to(socket.gameId).emit('user left', {game: getGame(socket.gameId), playerName: socket.playerName});

  });

  /**
   * Update the game.
   */
  socket.on('update game', function (data) {

    var gameId    = data.gameId;
    games[gameId] = data.game;

    io.to(gameId).emit('game updated', {game: games[gameId]});

  });

  socket.on('start game', function () {

    getGame(socket.gameId).started = true;
    io.to(socket.gameId).emit('game updated', {game: games[socket.gameId]});

  });

  socket.on('kick player', function (data) {

    var userIdToBeKicked = data.socketId

    socket.clients[userIdToBeKicked].onDisconnect();

  });

});

module.exports = app;
