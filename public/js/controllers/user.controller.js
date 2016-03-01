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
    '$location',
    'UserService',

    function ($scope, $location, UserService) {

      $scope.createUser = function () {

        var userData = {
          fullName   : $scope.newFullName,
          playerName : $scope.newPlayerName,
          email      : $scope.newEmail,
          password   : $scope.newPassword
        };

        console

        UserService.create(userData).success(function (data) {

          userData = {};

          if (data.success) {
            $location.path('/users/' + data.userId + '/dashboard')
          }

        });

      };

    }]);
