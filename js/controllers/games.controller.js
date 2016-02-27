var GameModel  = require('../models/game.model');
var StoryModel = require('../models/story.model');


/***********************************************************************************************************************
 *
 * The controller of the game information.
 *
 * @constructor
 *
 **********************************************************************************************************************/
GameController = function () {

  var self = this;

  /*********************************************************************************************************************
   *
   * Gets all games associated with a user.
   *
   * @param  {object}   request  - The request containing game information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.getAllGames = function (request, callback) {

    var result = { success: false, code: '', message: '' };
    var userId = request.params.userId;

    if (userId) {

      GameModel.find({creator:userId}, function (error, games) {

        if (error) {

          result.code    = 'g10002';
          result.message = 'An error occurred while trying to retrieve games.';

        }  else {

          result.success = true;
          result.code    = 'g10003';
          result.message = 'Games retrieved!';
          result.games    = games;

        }

        return callback(result);

      });

    } else {

      result.code    = 'g10001';
      result.message = 'User id not provided during game retrieval.';

      return callback(result);

    }

  };

  /*********************************************************************************************************************
   *
   * Creates a game associated with a user.
   *
   * @param  {object}   request  - The request containing game information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.createGame = function (request, callback) {

    var result = { success: false, code: '', message: '' };
    var game   = new GameModel();

    if (request.body.name && request.body.description && request.params.userId) {

      game.name        = request.body.name;
      game.description = request.body.description;
      game.creator     = request.params.userId;

      game.save( function(error) {

        if (error) {

            result.code    = 'g10005';
            result.message = 'An error occurred while trying to create new game.';

        } else {

          result.success = true;
          result.code    = 'g10006';
          result.message = 'Game created!';

        }

        return callback(result);

      });

    } else {

      result.code    = 'g10004';
      result.message = 'Game information is incomplete.';

      return callback(result);

    }
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
