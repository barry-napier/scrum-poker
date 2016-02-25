var express        = require('express');
var bodyParser     = require('body-parser');
var gameController = require('../../controllers/games.controller');
var urlencode      = bodyParser.urlencoded({ extended: false });
var router         = express.Router();

router.route('/users/:userId/games')
  /*********************************************************************************************************************
   *
   * GET '/users/:userId/games' - Get all games associated with user.
   *
   * @param  {object} request  - The request containing game information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .get(function (request, response) {

    gameController.getAllGames(request, function (result) {
      response.json(result);
    });

  })
  /*********************************************************************************************************************
   *
   * POST '/users/:userId/games' - Create a new game associated with user.
   *
   * @param  {object} request  - The request containing game information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .post(urlencode, function (request, response) {

    gameController.createGame(request, function (result) {
      response.json(result);
    });

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
