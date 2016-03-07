angular.module('gameCtrl', ['authService'])

.controller('gameController', function(Auth, $location, $http, $routeParams) {

  var self = this;

  self.error;
  self.stories = [];

  self.userId = $routeParams.userId;

  self.logoutUser = function () {

    Auth.logout();

    var url = '/';
    $location.hash(url);

    return false;

  };

  self.createGame = function () {

    $http.post('/api/users/' + self.userId + '/games', self)
    .success(function(data) {

      if (data.success) {

        var url = '/users/' + self.userId + '/dashboard';
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
