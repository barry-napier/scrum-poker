angular.module('userCtrl', ['userService', 'authService'])

.controller('userController', function(User, Auth, $location, $window) {

  var self = this;

  self.error;

  self.createUser = function () {

    User.create(self.userData)
    .success(function(data) {

      if (data.success) {

        self.userData = {};

        var url = '/login';

        $location.path(url);

      } else {

        self.error = data.message;

      }

    });

  };

  self.loginUser = function () {

    Auth.login(self.loginData.email, self.loginData.password)
    .success(function(data) {

      if (data.success) {

        self.userData = {};

        var userId = data.userId;
        var playerName = data.playerName;

        if (userId) {
          $window.localStorage.setItem('userId', userId);
          $window.localStorage.setItem('playerName', playerName);

          var url    = '/dashboard';

          $location.path(url);
        }

      } else {

        self.error = data.message;

      }

    });

  };

});