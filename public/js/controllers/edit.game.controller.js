angular.module('editGameCtrl', ['gameService', 'authService'])

.controller('editGameController', function(Game, Auth, $location, $routeParams, $http, $window, $scope) {

  $scope.logoutUser = function () { Auth.logout(); };

  $scope.error;
  $scope.game = {};

  $scope.action = 'Update';

  $scope.userId = $window.localStorage.getItem('userId');
  $scope.gameId = $routeParams.gameId;

  $scope.loadGame = function () {

    $scope.game.stories = $scope.stories;

    Game.get($scope.userId, $scope.gameId, $scope.game).success(function(data) {

      if (data.success) {

        $scope.game = data.game;
        $scope.game.stories = data.game.stories;

      } else {

        $scope.error = data.message;

      }

    });

    return false;

  };

  $scope.createUpdateGame = function () {

    var userId = $window.localStorage.getItem('userId');

    Game.update(userId, $scope.gameId, $scope.game).success(function(data) {

      if (data.success) {

        var url = '/dashboard';
        $location.path(url);

      } else {

        $scope.error = data.message;

      }

    });

    return false;

  };

  $scope.deleteStory = function (index) {

    $scope.game.stories.splice(index, 1);

  };

  $scope.addStory = function () {

    $scope.game.stories = $scope.game.stories || [];

    $scope.game.stories.push($scope.storyData);
    $('#myModal').modal('hide');
    $scope.storyData = {};

    return false;

  };

  $scope.loadGame();

});
