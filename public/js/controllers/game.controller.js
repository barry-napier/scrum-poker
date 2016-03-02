angular.module('gameCtrl', [])

.controller('gameController', function($http, $routeParams) {

  var self = this;

  self.error;

  self.games;

  self.getGames = function () {

    var id = $routeParams.userId;

    $http.get('/api/users/' + id + '/games')
    .success(function(data) {

      console.log(data);

      self.games = data.games;

    });

  };

  self.getGames();

});
