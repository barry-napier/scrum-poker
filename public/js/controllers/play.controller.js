angular.module('playCtrl', ['authService'])

.controller('playController', function(Auth, $location, $http, $routeParams, $scope, $window, socket) {

  $scope.logoutUser = function () { Auth.logout(); };

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
      value : 0
    },
    {
      name : 'Break',
      value : 0
    }
  ];

  $scope.URL               = $window.location.href;
  $scope.isAdmin           = Auth.isLoggedIn();
  $scope.gameId            = $routeParams.gameId;
  $scope.playerName        = '';

  /**
   * Invite team members to game
   */
  $scope.inviteTeam = function () {

    var storyList = '';

    for (var story in $scope.game.stories) {

      storyList += $scope.game.stories[story].name +
                   ' - ' +
                   $scope.game.stories[story].description +
                   ' - ' +
                   $scope.game.stories[story].link +
                   '%0D%0A%0D%0A';;

    }

    $scope.mailto = 'mailto:?' +
                    'subject=Scrum-Poker Game Invite' +
                    '&body=Hi,%0D%0A%0D%0AHere are the stories we will be reviewing:%0D%0A%0D%0A' +
                     storyList +
                    'Thanks' +
                    '%0D%0A%0D%0A' +
                     $scope.playerName +
                    '%0D%0A%0D%0A' +
                    'Join the game at : ' +
                     $scope.URL;

    $('#inviteTeamModal').modal('show');

  };

  /**
   * Updates the game on the client.
   */
  $scope.updateGame = function () {

    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  };

  /**
   * Vote on current story.
   */
  $scope.vote = function ($event, data) {

    var vote = {
      playerName : $scope.playerName,
      name       : data.name,
      value      : data.value
    };

    $scope.game.players[$scope.playerName].voted = true;

    $scope.game.stories[$scope.game.currentStory].votes[$scope.playerName] = vote;

    $scope.updateGame();

    $($event.currentTarget).addClass('magictime slideUp');

  };


  /**
   * Allows the user to join the game.
   */
  $scope.join = function () {

    var playerName = $window.localStorage.getItem('playerName');

    if (playerName) {

      socket.emit('join', { gameId : $scope.gameId, playerName : playerName});
      $scope.playerName = playerName;

    } else {

      $('#playerModal').modal('show');

    }

  };

  /**
   * Allows a new player to enter their Username and join game.
   */
  $scope.addPlayer = function () {

    var playerName = $('#player-name').val();

    console.log("Player Name: " + playerName);

    $window.localStorage.setItem('playerName', playerName);


    $('#playerModal').modal('hide');

    socket.emit('join', { gameId : $scope.gameId, playerName : playerName});
    $scope.playerName = playerName;

  };

  /**
   * Starts the game.
   */
  $scope.startGame = function () {

    socket.emit('start game');

  };

  /**
   * Removes the player from the game.
   *
   * @param player
   */
  $scope.kickPlayer = function (player) {

    console.log('Kick player :' + player.playerName + player.socketId);
    socket.emit('kick player', {socketId : player.socketId});

  };

  $scope.flipCards = function () {

    $scope.game.stories[$scope.game.currentStory].flipped = true;
    socket.emit('update game', { gameId : $scope.gameId, game : $scope.game });

  }

  // Socket Events
  socket.on('user joined', function (data) {

    var playerName = data.playerName;
    console.log('user Joined : ' + playerName);

    $scope.game = data.game;

  });

  socket.on('user left', function (data) {

    var playerName = data.playerName;
    console.log('user left : ' + playerName);

    $scope.game = data.game;

  });

  socket.on('game started', function (data) {

    console.log('Game Started!');

    $scope.game = data.game;

    var initialOffset = 440;
    var duration      = 60 * 60;
    var timer         = duration, minutes, seconds;

    setInterval(function () {

      minutes = parseInt(timer / 60, 10);
      seconds = parseInt(timer % 60, 10);

      minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;

      $('.circle_animation').css('stroke-dashoffset', initialOffset-(timer*(initialOffset/duration)));

      $('h2').text(minutes + ":" + seconds);

      if (--timer < 0) {
        timer = duration;
      }

    }, 1000);

  });

  socket.on('game updated', function (data) {

    console.log('Game Updated!');

    $scope.game = data.game;

  });

  $scope.join();

});
