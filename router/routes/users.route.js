var express            = require('express'),
    bodyParser         = require('body-parser'),
    usersController    = require('../../controllers/users.controller'),
    urlencode          = bodyParser.urlencoded({ extended: false }),
    router             = express.Router();

router.route('/users/signup')

  .post(urlencode, function (request, response) {

    var result = usersController.createNewUser(request);

    if (result) {
      response.status(201).json(result);
    } else {
      response.sendStatus(400);
    }

  });

router.route('/users/authenticate')

  .post(urlencode, function (request, response) {

    usersController.authenticate(request, function (result) {

      if (result) {
        response.status(200).json(result);
      } else {
        response.sendStatus(400);
      }

    });

  });

router.route('/users/:id')

  .get(function (request, response) {

    var id = request.params.id;

    usersController.getUserById(id, function (result) {
      if (result) {
        response.status(200).json(result);
      } else {
        response.sendStatus(400);
      }
    });

  });

module.exports = router;
