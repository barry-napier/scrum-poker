'use strict';

/**
 * @ngdoc function
 * @name scrumPoker.controller:CreateGameCtrl
 * @description
 * # CreateGameCtrl
 * Controller of the scrumPoker app
 */
angular.module('scrumPoker')

  .controller('CreateGameCtrl', [

    '$scope',
    '$location',

    function($scope, $location) {

      $scope.createGame = function() {

      if ($scope.username) {

        console.log('User is: ' + $scope.username);

        var gameId = Math.random().toString(36).substring(10);
        var path = '/games/' + gameId;

        console.log('Path is: ' + path);

        $location.path(path);
      }

    };

  }]);
