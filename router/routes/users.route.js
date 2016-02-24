var express         = require('express');
var bodyParser      = require('body-parser');
var usersController = require('../../controllers/users.controller');
var urlEncode       = bodyParser.urlencoded({ extended: false });
var router          = express.Router();

router.route('/users')
  /*********************************************************************************************************************
   *
   * POST '/users' - Create a new user.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .post(urlEncode, function (request, response) {

    usersController.createNewUser(request, function (result) {
      response.json(result);
    });

  });

router.route('/users/:userId')
  /*********************************************************************************************************************
   *
   * GET '/users/:userId' - Get user by id.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .get(function (request, response) {

    usersController.getUser(request, function (result) {
      response.json(result);
    });

  })
  /*********************************************************************************************************************
   *
   * PUT '/users/:userId' - Update user.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .put(urlEncode, function (request, response) {

    usersController.updateUser(request, function (result) {
      response.json(result);
    });

  })
  /*********************************************************************************************************************
   *
   * DELETE '/users/:userId' - Delete a user.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .delete(function (request, response) {

    usersController.deleteUser(request, function (result) {
      response.json(result);
    });

  });

router.route('/users/authenticate')
  /*********************************************************************************************************************
   *
   * POST '/users/authenticate' - Authenticates a user.
   *
   * @param  {object} request  - The request containing user information.
   * @param  {object} response - The response returned to the user.
   *
   ********************************************************************************************************************/
  .post(urlEncode, function (request, response) {

    usersController.authenticate(request, function (result) {
      response.json(result);
    });

  });

module.exports = router;
