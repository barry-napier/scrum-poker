var express            = require('express'),
    bodyParser         = require('body-parser'),
    gameController     = require('../../controllers/games.controller'),
    urlencode          = bodyParser.urlencoded({ extended: false }),
    router             = express.Router();

router.route('/users/:userId/games')

  .get( function (request, response) {

    var userId = request.params.userId;

    gameController.getGamesByUser(userId, function (result) {
      if (result) {
        response.status(200).json(result);
      } else {
        response.sendStatus(400);
      }
    });

  })

  .post(urlencode, function (request, response) {

    var result = gameController.createNewGame(request);

    if (result) {
      response.status(201).json(result);
    } else {
      response.sendStatus(400);
    }

  });

router.route('/users/:userId/games/:gameId')

    .get( function (request, response) {

      var gameId = request.params.gameId;

      gameController.getGameById(gameId, function (result) {
        if (result) {
          response.status(200).json(result);
        } else {
          response.sendStatus(400);
        }
      });

    })

module.exports = router;
