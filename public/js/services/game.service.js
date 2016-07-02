angular.module('gameService', [])

.factory('Game', function($http) {

  // create a new object
  var gameFactory = {};

  // get a single game
  gameFactory.get = function(userId, gameId) {
    return $http.get('/api/users/' + userId + '/games/' + gameId);
  };

  // get all games
  gameFactory.all = function(userId) {
    return $http.get('/api/users/' + userId + '/games');
  };

  // create a game
  gameFactory.create = function(userId, gameData) {
    return $http.post('/api/users/' + userId + '/games', gameData);
  };

  // update a game
  gameFactory.update = function(userId, gameId, gameData) {
    return $http.put('/api/users/' + userId + '/games/' + gameId, gameData);
  };

  // delete a game
  gameFactory.delete = function(userId, gameId) {
    return $http.delete('/api/users/' + userId + '/games/' + gameId);
  };

  // return our entire userFactory object
  return gameFactory;

});