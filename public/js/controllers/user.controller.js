angular.module('userCtrl', ['userService'])

.controller('userController', function(User) {

  var self = this;

  self.error;

  self.createUser = function () {
    console.log("Creating User : " + self.userData.playerName);

    User.create(self.userData)
    .success(function(data) {

      self.userData = {};

      if (data.success) {

        var userId = data.userId;

        $location.path('/users/' + userId + '');

      } else {

        self.error = data.message;

      }

    });
  };

});