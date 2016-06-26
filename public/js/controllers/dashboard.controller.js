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

  }

  $scope.getGames();

});
