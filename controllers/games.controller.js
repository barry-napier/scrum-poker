var Game  = require('../models/game.model'),
    Story = require('../models/story.model');

/**
 * The controller of the user information.
 */
GameController = function () {

  var self = this;


  self.getGamesByUser = function (userId, callback) {

    Game.getByUserId(userId, function (error, games) {

      var result;

      if (!error) {
        result = games;
      }

      callback(result);
    });

  };

  self.getGameById = function (gameId, callback) {

    Game.getById(gameId, function (error, game) {

      var result;

      if (!error) {
        result = game;
      }

      callback(result);
    });

  };

  self.createNewGame = function (request) {

    var game = new Game();

    game.name        = request.body.name;
    game.description = request.body.description;
    game.creator     = request.params.userId;

    game.save( function(error) {
      if (!error) {
        Game.find({})
          .populate('user')
          .exec(function(error, game) {
            return game;
          })
      }
    });
  };

  self.createNewStory = function (gameId, request) {

    var story = new Story();

    story.name        = request.body.name;
    story.description = request.body.description;

    story.save( function(error) {

      if (!error) {

        Game.getById(gameId, function (error, game) {

          game.stories.push(story);
          game.save(function(error) {
            if (!error) {
              Game.find({})
                  .populate('stories')
                  .exec(function(error, game) {
                    return game;
                  })
            }
          });

        });
      }
    });
  }

}

module.exports = new GameController();
