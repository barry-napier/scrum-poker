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
    'userService'
  ])

  .config(function($httpProvider) {

    $httpProvider.interceptors.push('AuthInterceptor');

  });