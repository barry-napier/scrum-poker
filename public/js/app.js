'use strict';

/**
 * @ngdoc overview
 * @name scrumPoker
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular.module('scrumPoker',

  [
    'scrumPoker.routes',
    'authService',
    'mainCtrl',
    'userCtrl',
    'dashboardCtrl',
    'gameCtrl',
    'playCtrl',
    'userService',
    'btford.socket-io'
  ])

  .config(function($httpProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');

  })
  .factory('socket', function ($rootScope) {

    var socket = io.connect();

    return {

      on: function (eventName, callback) {

        socket.on(eventName, function () {

          var args = arguments;

          $rootScope.$apply(function () {

            callback.apply(socket, args);

          });

        });

      },
      emit: function (eventName, data, callback) {

        socket.emit(eventName, data, function () {

          var args = arguments;

          $rootScope.$apply(function () {

            if (callback) {
              callback.apply(socket, args);
            }

          });

        })
      }
    };
  });