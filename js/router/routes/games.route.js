var express        = require('express');
var bodyParser     = require('body-parser');
var gameController = require('../../controllers/games.controller');
var auth           = require('../auth');
var makeJSON       = bodyParser.json();
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
  .get(auth, function (request, response) {

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
  .post(auth, makeJSON, function (request, response) {

    gameController.createGame(request, function (result) {
      response.json(result);
    });

  });

module.exports = router;
