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

    // signup page
    .when('/login', {
      templateUrl : 'views/login.html',
      controller  : 'userController',
      controllerAs: 'user'
    })

    // dashboard page
    .when('/users/:userId/dashboard', {
      templateUrl : 'views/dashboard.html',
      controller  : 'dashboardController',
      controllerAs: 'dashboard'
    })

    // game page
    .when('/users/:userId/games/create', {
      templateUrl : 'views/game.html',
      controller  : 'gameController',
      controllerAs: 'game'
    });

});