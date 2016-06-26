angular.module('gameCtrl', ['authService'])

.controller('gameController', function(Auth, $scope, $location, $http, $window) {

  $scope.error;
  $scope.stories = [];
  $scope.logoutUser = function () { Auth.logout(); };

  $scope.createGame = function () {

    var userId = $window.localStorage.getItem('userId');

    $http.post('/api/users/' + userId + '/games', self)
    .success(function(data) {

      if (data.success) {

        var url = '/dashboard';
        $location.path(url);

      } else {

        $scope.error = data.message;

      }

    });

    return false;

  };

  $scope.addStory = function () {

    $scope.stories.push($scope.storyData);
    $('#myModal').modal('hide');
    $scope.storyData = {};

    return false;

  };

});
