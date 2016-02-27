var express        = require('express'),
    bodyParser     = require('body-parser'),
    gameController = require('../../controllers/games.controller'),
    urlencode      = bodyParser.urlencoded({ extended: false }),
    router         = express.Router();

router.route('/users/:userId/games/:gameId/stories')

  .post(urlencode, function (request, response) {

    console.log('createNewStory POST');

    var gameId = request.params.gameId;

    var result = gameController.createNewStory(gameId, request);

    if (result) {
      response.status(201).json(result);
    } else {
      response.sendStatus(400);
    }

  });

module.exports = router;
