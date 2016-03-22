angular.module('gameCtrl', ['authService'])

.controller('gameController', function(Auth, $location, $http, $window) {

  var self = this;

  self.error;
  self.stories = [];

  self.logoutUser = function () {

    Auth.logout();

    var url = '/';
    $location.hash(url);

    return false;

  };

  self.createGame = function () {

    var userId = $window.localStorage.getItem('userId');

    $http.post('/api/users/' + userId + '/games', self)
    .success(function(data) {

      if (data.success) {

        var url = '/dashboard';
        $location.path(url);

      } else {

        self.error = data.message;

      }

    });

    return false;

  };

  self.addStory = function () {

    self.stories.push(self.storyData);
    $('#myModal').modal('hide');
    self.storyData = {};

    return false;

  };

});
