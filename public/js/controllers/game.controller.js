angular.module('gameCtrl', ['authService'])

.controller('gameController', function(Auth, $location, $http, $window, $scope) {


  $scope.error;
  $scope.game = {};
  $scope.stories = [];

  $scope.logoutUser = function () {

    Auth.logout();

    var url = '/';
    $location.hash(url);

    return false;

  };

  $scope.createGame = function () {

    var userId = $window.localStorage.getItem('userId');

    $scope.game.stories = $scope.stories;

    $http.post('/api/users/' + userId + '/games', $scope.game)
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
