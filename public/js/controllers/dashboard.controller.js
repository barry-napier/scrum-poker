angular.module('dashboardCtrl', ['authService'])

.controller('dashboardController', function(Auth, $location, $http, $routeParams, $window) {

  var self = this;

  self.error;

  self.games;

  self.logoutUser = function () {

    Auth.logout();

    var url    = '/';
    $location.hash(url);
    return false;

  };

  self.getGames = function () {

    var userId = $window.localStorage.getItem('userId');

    $http.get('/api/users/' + userId + '/games')
    .success(function(data) {

      self.games = data.games;

    });

  };

  self.loadGame = function (gameId) {

    var url = '/games/' + gameId;

    console.log('Opening game: ' + url);

    $location.path(url);
    return false;

  };

  self.getGames();

});
