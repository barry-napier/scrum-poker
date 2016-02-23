'use strict';

/**
 * @ngdoc function
 * @name cloudPoker.controller:GameCtrl
 * @description
 * # GameCtrl
 * Controller of the cloudPoker app
 */
angular.module('scrumPoker').controller(

  'GameCtrl',

  [
    '$scope',
    '$location',
    '$routeParams',
    'game',

    function($scope, $location, $routeParams, game) {

      $scope.game = game

      // $scope.currentUser = { id : $routeParams.userId };
      // $scope.gameId      = $routeParams.gameId;
      // $scope.isAdmin     = $routeParams.admin === 'true';

      // var path = '/game/' + $scope.gameId + '/user/' + $scope.currentUser.id;

      // $scope.deck = deck;

      // game.setup($scope.gameId);
      // $scope.users = game.users;
      // game.join($scope.gameId, path, $scope.currentUser);

    }
  ]
);
