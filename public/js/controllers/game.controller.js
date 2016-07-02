angular.module('gameCtrl', ['gameService', 'authService'])

.controller('gameController', function(Game, Auth, $location, $http, $window, $scope) {

  $scope.logoutUser = function () { Auth.logout(); };

  $scope.error;

  $scope.action = 'Create';

  $scope.createUpdateGame = function () {

    var userId = $window.localStorage.getItem('userId');

    Game.create(userId, $scope.game).success(function(data) {

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

    $scope.game.stories = $scope.game.stories || [];

    $scope.game.stories.push($scope.storyData);
    $('#myModal').modal('hide');
    $scope.storyData = {};

    return false;

  };

  $scope.deleteStory = function (index) {

    $scope.game.stories.splice(index, 1);

  };

});
