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

        console.log('Creating User.');

        var userData = {
          fullName   : $scope.newFullName,
          playerName : $scope.newPlayerName,
          email      : $scope.newEmail,
          password   : $scope.newPassword
        };

        UserService.create(userData).success(function (data) {

          userData = {};

          if (data.success) {
            $location.path('/users/' + data.userId + '/dashboard')
          }

        });

      };

      self.loginUser = function () {

        var userData = {
          email      : $scope.email,
          password   : $scope.password
        };

        UserService.login(userData).success(function (data) {

          userData = {};

          if (data.success) {
            $location.path('/users/' + data.userId + '/dashboard')
          }

        });

      };

    }]);
