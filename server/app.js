var express   = require('express');
var app       = express();
var server    = require('http').createServer(app);
var config    = require('./config/');
var router    = require('./router/')(app);
var db        = require('./database/');
var logger    = config.logger;
var io        = require('socket.io')(server);
var GameModel = require('./models/game.model');

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

var clients = {};
var games   = {};

io.on('connection', function (socket) {

  clients[socket.id] = socket;

  /**
   * Initialise the game.
   */
  socket.on('initialise game', function (data) {

    var gameId = data.gameId;
    var game = games[gameId];

    if (!game) {

      GameModel.findById(gameId).populate('creator').lean().exec(function (error, savedGame) {

        games[gameId] = savedGame;

        var storyNames = Object.keys(games[gameId].stories).reverse();

        games[gameId].currentStory = storyNames[games[gameId].currentStoryIndex];

        io.to(gameId).emit('game updated', {game: games[gameId]});

      });

    }

  });

  /**
   * Join function will add users to game.
   */
  socket.on('join', function (data) {

    var gameId     = data.gameId;
    var playerName = data.playerName;

    socket.join(gameId);
    socket.gameId     = gameId;
    socket.playerName = playerName;

    var player = games[gameId].players[playerName];

    if (!player) {

      games[gameId].numOfPlayers++;
      games[gameId].players[playerName] = {
        playerName:playerName,
        voted: false,
        socketId: socket.id
      };

    }

    io.to(gameId).emit('user joined', {game: games[gameId], playerName: playerName});

  });

  socket.on('admin authentication', function (data) {

    var userId    = data.userId;
    var gameId    = data.gameId;
    var creator   = games[gameId].creator;
    var creatorId = creator._id.toString();
    var isAdmin = userId === creatorId;

    socket.emit('isAdmin', {isAdmin : isAdmin});

  });

  /**
   * when the user disconnects.
   */
  socket.on('disconnect', function () {

    console.log("disconnect: ", socket.id);

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
  socket.on('start game', function (data) {

    var gameId = data.gameId;

    games[gameId].started = true;

    io.to(socket.gameId).emit('game started', {game: games[gameId]});

  });

  socket.on('nudge player', function (data) {

    io.to(data.socketId).emit('nudged');

  });

  socket.on('kick player', function (data) {

    console.log('Kick : ' + data.socketId);
    io.to(data.socketId).emit('kicked');

  });

});

module.exports = app;
