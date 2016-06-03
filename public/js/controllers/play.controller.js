angular.module('playCtrl', ['authService'])

.controller('playController', function(Auth, $location, $http, $routeParams, $scope, $window, socket) {

  $scope.isAdmin           = Auth.isLoggedIn();
  $scope.gameId            = $routeParams.gameId;
  $scope.playerName        = '';
  $scope.game              = {};
  $scope.game.URL          = $window.location.href;
  $scope.game.players      = [];
  $scope.game.votes        = {};
  $scope.game.stories      = {};
  $scope.game.currentStory = "CCDS-221";

  $scope.game.stories["CCDS-221"]  = {name : 'CCDS-221',  description : 'Keyboard Shortcuts', value: '', link:'http://google.com'};
  $scope.game.stories["CCDS-2246"] = {name : 'CCDS-2246', description : 'Associate Layouts with B2B', value: '', link:'http://google.com'};

  $('div.selection-section').find('div.card').click(function () {
    $(this).toggleClass('magictime slideUp');
    $scope.game.votes[$scope.playerName] = {username:$scope.playerName, value: $(this).find('span').val()}
  });


  /**
   * Invite team members to game
   */
  $scope.inviteTeam = function () {

    var storyList = '';

    for (story in $scope.game.stories) {

      var storyStr = $scope.game.stories[story].name +
                     ' - ' +
                     $scope.game.stories[story].description +
                     ' - ' +
                     $scope.game.stories[story].link +
                     '%0D%0A%0D%0A';

      storyList += storyStr;

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
                     $scope.game.URL;

    $('#inviteTeamModal').modal('show');

  }


  /**
   * Allows the user to join the game.
   */
  $scope.join = function () {

    var username = $window.localStorage.getItem('username');

    if (username) {

      socket.emit('join', { gameId : $scope.gameId, username : username});
      $scope.playerName = username;

    } else {

      $('#playerModal').modal('show');

    }

  };

  /**
   * Allows a new player to enter their Username and join game.
   */
  $scope.addPlayer = function () {

    var username = $('#player-name').val();

    console.log("Player Name: " + username);

    $scope.game.players.push(username);
    $scope.game.username = $window.localStorage.setItem('username', username);

    $scope.game.username = username;

    $('#playerModal').modal('hide');

    socket.emit('join', { gameId : $scope.gameId, username : username});
    $scope.playerName = username;
  };

  // Socket Events
  socket.on('user joined', function (data) {

    var username = data.username;
    console.log('user Joined : ' + username);

    $scope.game.id = $routeParams.gameId;
    $scope.game.players = data.game.users;

  });

  socket.on('user left', function (data) {

    var username = data.username;
    console.log('user left : ' + username);

    $scope.game.id = $routeParams.gameId;
    $scope.game.players = data.game.users;

  });

  $scope.join();

});
