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

  game.id            = gameId;
  game.users         = {};
  game.numberOfUsers = 0;
  game.subject       = null;
  game.displayVotes  = false;

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

    var gameId   = data.gameId;
    var username = data.username;

    console.log('Game Id: '  + gameId);
    console.log('Username: ' + username);

    socket.username = username;
    socket.gameId   = gameId;

    console.log('Socket Username: ' + socket.username);

    getGame(gameId).numberOfUsers++;
    getGame(gameId).users[username] = {username:username, voted: false, score:0};

    console.log('Number of Users: ' + getGame(gameId).numberOfUsers);
    console.log('Users: ' + getGame(gameId).users);

    io.emit('user joined', {game: getGame(gameId), username: username});

  });

  /**
   * when the user disconnects.
   */
  socket.on('disconnect', function () {

    getGame(socket.gameId).numberOfUsers--;
    delete getGame(socket.gameId).users[socket.username];

    console.log('Username disconnected: ' + socket.username);
    console.log('Number of Users: ' + getGame(socket.gameId).numberOfUsers);

    io.emit('user left', {game: getGame(socket.gameId), username: socket.username});

  });

});

module.exports = app;
