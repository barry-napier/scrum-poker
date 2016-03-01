'use strict';

/**
 * @ngdoc overview
 * @name scrumPoker
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular.module('scrumPoker', ['ngRoute', 'btford.socket-io', 'authService'])

  .factory(

    'mySocket', 

    function (socketFactory) {
      return socketFactory();
    }
  )

  .config(function ($routeProvider, $httpProvider) {

    $routeProvider

      .when('/', {
        templateUrl : 'views/main.html',
        controller  : 'MainCtrl'
      })

      .when('/users/signup', {
        templateUrl : 'views/signup.html',
        controller  : 'UserCtrl'
      })

      .when('/users/login', {
        templateUrl : 'views/signup.html',
        controller  : 'UserCtrl'
      })

      .when('/users/:id/dashboard', {
        templateUrl : 'views/dashboard.html',
        controller  : 'UserCtrl'
      })

      .otherwise({
        redirectTo  : '/'
      });

      // attach our auth interceptor to the http requests
      $httpProvider.interceptors.push('AuthInterceptor');

    });
