var config  = require('../config/');
var jwt     = require('jsonwebtoken');

module.exports = function(req, res, next) {

  var secret = config.secret;
  var token  = req.headers['x-access-token'];

  if (token) {

    jwt.verify(token, secret, function(err, decoded) {

      if (err) {

        res.status(403).send({
          success: false,
          message: 'Failed to authenticate token.'
        });

      } else {

        req.decoded = decoded;
        next();

      }
    });

  } else {

    res.status(403).send({
      success: false,
      message: 'No token provided.'
    });

  }

};
