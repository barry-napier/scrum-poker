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
    'UserService',

    function ($scope, $http, $location, $httpParamSerializer, UserService) {

      var self = this;

      self.createUser = function () {

        var userData = {
          fullName   : $scope.fullName,
          playerName : $scope.playerName,
          email      : $scope.email,
          password   : $scope.password
        };

        UserService.create(userData).success(function (data) {

          userData = {};

          if (data.success) {
            $location.path('/users/' + data.userId + '/dashboard')
          }

        });

      };

    }]);
