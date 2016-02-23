var express            = require('express'),
    bodyParser         = require('body-parser'),
    usersController    = require('../../controllers/users.controller'),
    urlencode          = bodyParser.urlencoded({ extended: false }),
    router             = express.Router();

router.route('/users/:id/games')

  .get( function (request, response) {

    usersController.getAllUsers( function (result) {
      if (result) {
        response.status(200).json(result);
      } else {
        response.sendStatus(400);
      }
    });

  })

  .post(urlencode, function (request, response) {

    var result = usersController.createNewUser(request);

    if (result) {
      response.status(201).json(result);
    } else {
      response.sendStatus(400);
    }

  });

module.exports = router;
