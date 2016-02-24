'use strict';

/**
 * @ngdoc function
 * @name scrumPoker.controller:CreateGameCtrl
 * @description
 * # CreateGameCtrl
 * Controller of the scrumPoker app
 */
angular.module('scrumPoker')

  .controller('UserCtrl', [

    '$scope',
    '$http',
    '$location',
    '$httpParamSerializer',

    function($scope, $http, $location, $httpParamSerializer) {

      var URL = '/api/users';

      $scope.createUser = function() {

        var data = {
          fullName   : $scope.fullName,
          playerName : $scope.playerName,
          email      : $scope.email,
          password   : $scope.password
        };

        $http({
          url: URL + '/signup',
          method: 'POST',
          data: $httpParamSerializer(data),
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).success(function(response) {

          var userId = response._id;
          $location.path('/users/'+ userId +'/dashboard');

        });

      };

      $scope.loginUser = function() {

        var data = {
          email      : $scope.email,
          password   : $scope.password
        };

        $http({
          url: URL + '/login',
          method: 'POST',
          data: $httpParamSerializer(data), // Make sure to inject the service you choose to the controller
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded' // Note the appropriate header
          }
        }).success(function(response) {

          var userId = response._id;
          $location.path('/users/'+ userId +'/dashboard');

        });

      };

    }]);
