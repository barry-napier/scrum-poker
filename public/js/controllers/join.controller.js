'use strict';

/**
 * @ngdoc function
 * @name cloudPoker.controller:JoinGameCtrl
 * @description
 * # JoinGameCtrl
 * Controller of the cloudPoker app
 */
angular.module('cloudPoker')
  .controller('JoinGameCtrl', ['$scope', '$location', '$routeParams', function($scope, $location, $routeParams) {

    $scope.submit = function() {

      var gameId   = $routeParams.gameId;
      var path = '/game/' + gameId + '/user/' + $scope.username + '/false';

      console.log('Path is: ' + path);

      $location.path(path);
    };

  }]);