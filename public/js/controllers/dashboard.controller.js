angular.module('dashboardCtrl', ['authService'])

.controller('dashboardController', function(Auth, $location, $http, $routeParams) {

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

  self.getGames = function () {

    $http.get('/api/users/' + self.userId + '/games')
    .success(function(data) {

      self.games = data.games;

    });

  };

  self.getGames();

});
