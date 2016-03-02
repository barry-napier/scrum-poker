angular.module('scrumPoker.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

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
      templateUrl : 'views/signup.html',
      controller  : 'userController',
      controllerAs: 'user'
    })

    // dashboard page
    .when('/users/:userId/dashboard', {
      templateUrl : 'views/dashboard.html',
      controller  : 'gameController',
      controllerAs: 'games'
    });

  //$locationProvider.html5Mode({
  //  enabled: true,
  //  requireBase: false
  //});

});