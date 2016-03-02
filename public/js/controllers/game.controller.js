angular.module('gameCtrl', ['authService'])

.controller('gameController', function(Auth, $location, $http, $routeParams) {

  var self = this;

  self.error;

  self.games;

  self.userId = $routeParams.userId;

  self.logoutUser = function () {

    Auth.logout();

    var url    = '/';
    $location.hash(url);
    return false;

  };

  self.createGame = function () {

    $location.hash(url);
    return false;

  };

  self.getGames = function () {

    $http.get('/api/users/' + self.userId + '/games')
    .success(function(data) {

      console.log(data);

      self.games = data.games;

    });

  };

  self.getGames();

});
