angular.module('playCtrl', ['authService'])

.controller('playController', function(Auth, $location, $http, $routeParams, $window) {

  var self = this;

  self.error;
  self.game;

  self.gameId = $routeParams.gameId;
  self.isAdmin = Auth.isLoggedIn();

  self.currentStory = 0;

  self.players = [];

  self.getGame = function () {

    $http.get('/api/games/' + self.gameId)
    .success(function(data) {

      if (data.success) {

        self.game = data.game;
        self.setupPlayer();

      } else {

        self.error = data.message;

      }

    });

  };

  self.setupPlayer = function () {

    self.playerName = $window.localStorage.getItem('playerName');

    if (!self.playerName) {
      // Show player Modal
    }

  };

  self.getGame();

});
