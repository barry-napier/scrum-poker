angular.module('playCtrl', ['gameService', 'authService'])

.controller('playController', function(Game, Auth, $location, $http, $routeParams, $scope, $window, socket) {

  /*********************************************************************************************************************
   *
   * Logout user.
   *
   ********************************************************************************************************************/
  $scope.logoutUser = function () {

    Auth.logout();

  };

  /*********************************************************************************************************************
   *
   * The card selections for the game.
   *
   ********************************************************************************************************************/
  $scope.cardSelections = [
    {
      name : '0',
      value : 0
    },
    {
      name : '1/2',
      value : 0.5
    },
    {
      name : '1',
      value : 1
    },
    {
      name : '2',
      value : 2
    },
    {
      name : '3',
      value : 3
    },
    {
      name : '5',
      value : 5
    },
    {
      name : '8',
      value : 8
    },
    {
      name : '13',
      value : 13
    },
    {
      name : '20',
      value : 20
    },
    {
      name : '40',
      value : 40
    },
    {
      name : '100',
      value : 100
    },
    {
      name : '?',
      value : -1
    },
    {
      name : 'Break',
      value : -2
    }
  ];

  $scope.gameId     = $routeParams.gameId;
  $scope.userId     = $window.localStorage.getItem('userId');
  $scope.playerName = '';
  $scope.isAdmin    = false;

  /*********************************************************************************************************************
   *
   * Initialise the Game
   *
   ********************************************************************************************************************/
  $scope.initialiseGame = function () {

    if (!$scope.game) {

      socket.emit('initialise game', {gameId : $scope.gameId});

    }

  };

  /*********************************************************************************************************************
   *
   * Allows the user to join the game.
   *
   ********************************************************************************************************************/
  $scope.join = function () {

    var playerName = $window.localStorage.getItem('playerName');

    if (playerName) {

      socket.emit('join', { gameId : $scope.gameId, playerName : playerName});
      $scope.playerName = playerName;

    } else {

      $('#playerModal').modal('show');

    }

  };

  /*********************************************************************************************************************
   *
   * Allows a new player to enter their Username and join game.
   *
   ********************************************************************************************************************/
  $scope.addPlayer = function () {

    var playerName = $('#player-name').val();

    $window.localStorage.setItem('playerName', playerName);

    $('#playerModal').modal('hide');

    socket.emit('join', { gameId : $scope.gameId, playerName : playerName});
    $scope.playerName = playerName;

  };

  /*********************************************************************************************************************
   *
   * Check if user is the Administrator.
   *
   ********************************************************************************************************************/
  $scope.adminAuthentication = function () {

    socket.emit('admin authentication', { userId : $scope.userId, gameId : $scope.gameId });

  };

  /*********************************************************************************************************************
   *
   * Starts the game.
   *
   ********************************************************************************************************************/
  $scope.startGame = function () {

    socket.emit('start game', {gameId: $scope.gameId});

  };

  /*********************************************************************************************************************
   *
   * Updates the game on the client.
   *
   ********************************************************************************************************************/
  $scope.updateGame = function () {

    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /*********************************************************************************************************************
   *
   * Vote on current story.
   *
   ********************************************************************************************************************/
  $scope.vote = function ($event, data) {

    var vote = {
      playerName : $scope.playerName,
      name       : data.name,
      value      : data.value
    };

    $scope.game.stories[$scope.game.currentStory].votes[$scope.playerName] = vote;
    $scope.game.stories[$scope.game.currentStory].results.push(data.value);

    var votes = Object.keys($scope.game.stories[$scope.game.currentStory].votes);

    if ($scope.game.numOfPlayers === votes.length) {

      $scope.flipCards();

    }

    $($event.currentTarget).addClass('magictime slideUp');

    $scope.updateGame();

  };

  /*********************************************************************************************************************
   *
   * Flip the cards.
   *
   ********************************************************************************************************************/
  $scope.flipCards = function () {

    $scope.game.stories[$scope.game.currentStory].count = {};

    var playerList = Object.keys($scope.game.players);

    playerList.forEach( function (i) {

      var vote = {
        playerName : $scope.game.players[i].playerName,
        name       : '?',
        value      : -2
      };

      if (!$scope.game.stories[$scope.game.currentStory].votes[$scope.game.players[i].playerName]) {

        $scope.game.stories[$scope.game.currentStory].votes[$scope.game.players[i].playerName] = vote;

      }

    });

    // Remove negative numbers from results list.
    var filteredResults = _.filter($scope.game.stories[$scope.game.currentStory].results, function(num) {
      return num > 0;
    });

    if (filteredResults) {

      // Count the occurrences of each vote.
      $scope.game.stories[$scope.game.currentStory].count = _.countBy(filteredResults);

      // Create the sorted results map.
      $scope.game.stories[$scope.game.currentStory].chain = _.chain($scope.game.stories[$scope.game.currentStory].count).map(function (value, key) {

        return {key : key, value : value}

      }).sortBy('value')
      .value()
      .reverse();

      $scope.game.stories[$scope.game.currentStory].finalResult = $scope.game.stories[$scope.game.currentStory].chain[0].key;

    }

    $scope.game.results = [];
    $scope.game.stories[$scope.game.currentStory].flipped = true;
    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /*********************************************************************************************************************
   *
   * Move to Previous Story.
   *
   ********************************************************************************************************************/
  $scope.previousStory = function () {

    $scope.game.currentStoryIndex--;
    $scope.game.currentStory = Object.keys($scope.game.stories).reverse()[$scope.game.currentStoryIndex];

    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /*********************************************************************************************************************
   *
   * Move to Next Story.
   *
   ********************************************************************************************************************/
  $scope.nextStory = function () {

    $scope.game.currentStoryIndex++;
    $scope.game.currentStory = Object.keys($scope.game.stories).reverse()[$scope.game.currentStoryIndex];

    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /*********************************************************************************************************************
   *
   * Replay the game.
   *
   ********************************************************************************************************************/
  $scope.replay = function () {

    $scope.game.stories[$scope.game.currentStory].votes = {};
    $scope.game.stories[$scope.game.currentStory].count = {};
    $scope.game.stories[$scope.game.currentStory].results = [];
    $scope.game.stories[$scope.game.currentStory].flipped = false;

    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /*********************************************************************************************************************
   * Nudges a player from the game.
   *
   * @param player
   ********************************************************************************************************************/
  $scope.nudgePlayer = function (player) {

    socket.emit('nudge player', {socketId : player.socketId});

  };

  /*********************************************************************************************************************
   * Kicks a player from the game.
   *
   * @param player
   ********************************************************************************************************************/
  $scope.kickPlayer = function (player) {

    $scope.game.numOfPlayers--;
    delete $scope.game.players[player.playerName];
    delete $scope.game.stories[$scope.game.currentStory].votes[player.playerName];

    socket.emit('kick player', {socketId : player.socketId});
    $scope.updateGame();

    var votes = Object.keys($scope.game.stories[$scope.game.currentStory].votes);

    if ($scope.game.numOfPlayers === votes.length) {

      $scope.flipCards();

    }

  };

  $scope.initialiseGame();
  $scope.join();
  $scope.adminAuthentication();

  /*********************************************************************************************************************
   *
   * Socket Events
   *
   ********************************************************************************************************************/

  socket.on('user joined', function (data) {

    $scope.game = data.game;

  });

  socket.on('user left', function (data) {

    $scope.game = data.game;

  });

  socket.on('isAdmin', function (data) {

    $scope.isAdmin = data.isAdmin;

  });

  socket.on('game started', function (data) {

    $scope.game = data.game;

  });

  socket.on('nudged', function () {

    alert('You have been nudged by the game administrator!');
    $.titleAlert("Nudged!", {
      requireBlur:false,
      stopOnFocus:false,
      duration:10000,
      interval:700
    });

  });

  socket.on('kicked', function () {

    alert('You have been kicked by the game administrator!');
    $.titleAlert("Kicked!", {
      requireBlur:false,
      stopOnFocus:false,
      duration:10000,
      interval:700
    });

    $window.localStorage.removeItem('userId');
    $window.localStorage.removeItem('playerName');

    $location.path('/');

  });

  socket.on('game updated', function (data) {

    $scope.game = data.game;

  });

  /*********************************************************************************************************************
   *
   * Timer
   *
   ********************************************************************************************************************/
  //var initialOffset = 440;
  //var duration      = 60 * $scope.game.duration;
  //var timer         = duration, minutes, seconds;
  //
  //$scope.game.timer = timer;
  //
  //setInterval(function () {
  //
  //  minutes = parseInt($scope.game.timer / 60, 10);
  //  seconds = parseInt($scope.game.timer % 60, 10);
  //
  //  minutes = minutes < 10 ? "0" + minutes : minutes;
  //  seconds = seconds < 10 ? "0" + seconds : seconds;
  //
  //  $('.circle_animation').css('stroke-dashoffset', initialOffset-($scope.game.timer*(initialOffset/duration)));
  //
  //  $('h2').text(minutes + ":" + seconds);
  //
  //  if (--$scope.game.timer < 0) {
  //    $scope.game.timer = duration;
  //  }
  //
  //}, 1000);


});