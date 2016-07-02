angular.module('scrumPoker.routes', ['ngRoute'])

.config(function($routeProvider) {

  $routeProvider

    .when('/', {
      templateUrl : 'views/main.html',
      controller  : 'mainController'
    })

    // signup page
    .when('/signup', {
      templateUrl : 'views/signup.html',
      controller  : 'userController',
      controllerAs: 'user'
    })

    // login page
    .when('/login', {
      templateUrl : 'views/login.html',
      controller  : 'userController',
      controllerAs: 'user'
    })

    // dashboard page
    .when('/dashboard', {
      templateUrl : 'views/dashboard.html',
      controller  : 'dashboardController',
      controllerAs: 'dashboard'
    })

    // game page
    .when('/games/create', {
      templateUrl : 'views/game.html',
      controller  : 'gameController',
      controllerAs: 'game'
    })

    // game page
    .when('/games/:gameId/edit', {
      templateUrl : 'views/game.html',
      controller  : 'editGameController',
      controllerAs: 'game'
    })

    // play page
    .when('/games/:gameId', {
      templateUrl : 'views/play.html',
      controller  : 'playController',
      controllerAs: 'play'
    });

});