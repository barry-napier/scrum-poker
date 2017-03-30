angular.module('dashboardCtrl', ['gameService', 'authService'])

.controller('dashboardController', function(Game, Auth, $scope, $location, $http, $routeParams, $window) {

  $scope.logoutUser = function () { Auth.logout(); };

  $scope.games;
  $scope.playerName = $window.localStorage.getItem('playerName');
  $scope.userId     = $window.localStorage.getItem('userId');


  $scope.getGames = function () {

    Game.all($scope.userId).success(function(data) {

      $scope.games = data.games;

    });

  };

  $scope.loadGame = function (gameId) {

    var url = '/games/' + gameId;

    $location.path(url);

    return false;

  };

  $scope.deleteGame = function (gameId) {

    Game.delete($scope.userId, gameId).success(function() {

      $scope.getGames();

    });

  };

  /**
   * Invite team members to game
   */
  $scope.inviteTeam = function (gameId, stories) {

    var url = '/#/games/' + gameId;

    $scope.URL = window.location.origin + url;

    var storyList = '';

    for (story in stories) {

      storyList += stories[story].name +
      ' - ' +
      stories[story].link +
      '%0D%0A%0D%0A';

    }

    $scope.mailto = 'mailto:?' +
    'subject=Scrum-Poker Game Invite - ' + $scope.games[gameId].name +
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

  $scope.getGames();

});
