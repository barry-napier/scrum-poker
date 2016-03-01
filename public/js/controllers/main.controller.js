'use strict';

/**
 * @ngdoc function
 * @name cloudPoker.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the cloudPoker app
 */
angular.module('scrumPoker')

  .controller('MainCtrl', function($rootScope, $location, Auth) {

    var self = this;

    // get info if a person is logged in
    self.loggedIn = Auth.isLoggedIn();

    // check to see if a user is logged in on every request
    $rootScope.$on('$routeChangeStart', function () {

      self.loggedIn = Auth.isLoggedIn();

      // get user information on page load
      Auth.getUser().then(function (data) {
        self.user = data.data;
      });

    });

  });