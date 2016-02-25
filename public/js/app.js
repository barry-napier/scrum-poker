'use strict';

/**
 * @ngdoc overview
 * @name scrumPoker
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
var scrumPoker = angular.module('scrumPoker', ['ngRoute', 'btford.socket-io'])

  .factory(

    'mySocket', 

    function (socketFactory) {
      return socketFactory();
    }
  )

  .factory(

    'game',

    function() {

      var game = {};

      game.users = [];
      game.voteRevealed = false;
      game.subjectIsSet = false;
      game.voteCount = null;
      game.roomName = null;

      return game

    }
  )

  .config(function ($routeProvider, $locationProvider) {

    $routeProvider

      .when('/', {
        templateUrl : 'views/main.html',
        controller  : 'MainCtrl'
      })

      .when('/users/signup', {
        templateUrl : 'views/signup.html',
        controller  : 'UserCtrl'
      })

      .when('/users/:id/dashboard', {
        templateUrl : 'views/dashboard.html',
        controller  : 'UserCtrl'
      })

      .when('/games/create', {
        templateUrl : 'views/create-game.html',
        controller  : 'CreateGameCtrl'
      })

      .when('/games/:gameId', {
        templateUrl : 'views/game.html',
        controller  : 'GameCtrl'
      })

      .otherwise({
        redirectTo  : '/'
      });

    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    });

    });
