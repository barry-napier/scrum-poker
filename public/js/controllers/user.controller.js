angular.module('userCtrl', ['userService', 'authService'])

.controller('userController', function(User, Auth, $location) {

  var self = this;

  self.error;

  self.createUser = function () {

    User.create(self.userData)
    .success(function(data) {

      if (data.success) {

        self.userData = {};

        var url    = '/login';

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
        var url    = '/users/' + userId + '/dashboard';

        $location.path(url);

      } else {

        self.error = data.message;

      }

    });

  };

});