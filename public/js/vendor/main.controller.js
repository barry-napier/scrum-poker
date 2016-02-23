'use strict';

/**
 * @ngdoc function
 * @name buildCheck.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloudPoker app
 */
angular.module('scrumPoker')
  .controller('MainCtrl',

    function($scope) {

      $scope.createGame = function () {
        console.log('create game!!!!!!!!!!!!!!!!!!!')
        io.emit('create game', 'Hello there');
        return false;
      };


    }

  );
