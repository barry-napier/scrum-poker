angular.module('playCtrl', ['authService'])

.controller('playController', function(Auth, $location, $http, $routeParams) {

  var self = this;

  self.error;
  self.games;

  self.userId = $routeParams.userId;
  self.gameId = $routeParams.gameId;

  self.isAdmin = Auth.isLoggedIn;

  self.getGame = function () {

    $http.get('/api/users/' + self.userId + '/games/' + self.gameId, self)
    .success(function(data) {

      if (data.success) {

        console.log(data);

      } else {

        self.error = data.message;

      }

    });

  };

  self.getGame();

});
