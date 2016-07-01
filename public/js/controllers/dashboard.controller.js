angular.module('dashboardCtrl', ['authService'])

.controller('dashboardController', function(Auth, $scope, $location, $http, $routeParams, $window) {

  $scope.games;
  $scope.logoutUser = function () { Auth.logout(); };


  $scope.getGames = function () {

    var userId = $window.localStorage.getItem('userId');

    $http.get('/api/users/' + userId + '/games')
    .success(function(data) {

      $scope.games = data.games;

    });

  };

  $scope.loadGame = function (gameId) {

    var url = '/games/' + gameId;

    console.log('Opening game: ' + url);

    $location.path(url);
    return false;

  };

  $scope.deleteGame = function (gameId) {

    var userId = $window.localStorage.getItem('userId');

    $http.delete('/api/users/' + userId + '/games/' + gameId)
    .success(function(data) {

      $scope.getGames();

    });

  };

  /**
   * Invite team members to game
   */
  $scope.inviteTeam = function (gameId, stories) {

    var url = '/#/games/' + gameId;

    console.log('Opening game: ' + url);

    $scope.URL = window.location.origin + url;

    var storyList = '';

    for (var i=0; i < stories.length; i++) {

      storyList += stories[i].name +
      ' - ' +
      stories[i].description +
      ' - ' +
      stories[i].link +
      '%0D%0A%0D%0A';

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

  $scope.getGames();

});
