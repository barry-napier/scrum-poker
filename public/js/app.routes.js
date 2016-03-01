angular.module('scrumPoker.routes', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {

  $routeProvider

    .when('/', {
      templateUrl : 'views/main.html',
      controller  : 'mainController'
    })

    // login page
    .when('/signup', {
      templateUrl : 'views/signup.html',
      controller  : 'userController',
      controllerAs: 'signup'
    });

  //$locationProvider.html5Mode({
  //  enabled: true,
  //  requireBase: false
  //});

});