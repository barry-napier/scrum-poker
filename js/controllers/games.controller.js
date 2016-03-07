var GameModel  = require('../models/game.model');
var StoryModel = require('../models/story.model');
var config     = require('../config/');
var logger     = config.logger;


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

    var result = { success: false, message: '' };
    var userId = request.params.userId;

    GameModel.find({creator:userId}, function (error, games) {

      if (error) {

        result.message = 'An error occurred while trying to retrieve games.';

      }  else {

        result.success = true;
        result.message = 'Games retrieved!';
        result.games    = games;

      }

      return callback(result);

    });


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

    var result = { success: false, message: '' };
    var game   = new GameModel();

    if (request.body.name && request.body.description && request.params.userId) {

      game.name        = request.body.name;
      game.description = request.body.description;
      game.creator     = request.params.userId;
      game.stories     = [];

      var stories = request.body.stories;

      for (var i=0; i > stories.length; i++) {

        var story = new StoryModel();

        story.name        = stories[i].name;
        story.description = stories[i].description;

        story.save( function (error, story) {

          if (error) {

            result.message = 'An error occurred while trying to create new story.';
            result.error = error.message;

            logger.error(error.message);

            return callback(result);

          } else {

            game.stories.push(story);

          }

        });
      }

      game.save( function (error) {

        if (error) {

          result.message = 'An error occurred while trying to create new game.';
          result.error = error.message;

          logger.error(error.message);

        } else {

          result.success = true;
          result.message = 'Game created!';

        }

        return callback(result);

      });

    } else {

      result.message = 'Game information is incomplete.';

      return callback(result);

    }
  };

};

module.exports = new GameController();
