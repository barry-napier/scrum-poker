var express        = require('express'),
    bodyParser     = require('body-parser'),
    gameController = require('../../controllers/games.controller'),
    urlencode      = bodyParser.urlencoded({ extended: false }),
    router         = express.Router();

router.route('/users/:userId/games/:gameId/stories')
  /*********************************************************************************************************************
   *
   * POST '/users/:userId/games/:gameId/stories' - Create a new user.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .post(urlencode, function (request, response) {

    var gameId = request.params.gameId;
    var result = gameController.createNewStory(gameId, request);

    if (result) {
      response.status(201).json(result);
    } else {
      response.sendStatus(400);
    }

  });

module.exports = router;
