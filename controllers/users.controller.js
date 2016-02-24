var User   = require('../models/user.model'),
    config = require('../config/'),
    jwt    = require('jsonwebtoken');

// super secret for creating tokens
var superSecret = config.secret;

/**
 * The controller of the user information.
 */
UserController = function () {

  var self = this;

  self.getUserById = function (id, callback) {

    User.getById(id, function (error, users) {

      var result;

      if (!error) {
        result = users;
      }

      callback(result);
    });

  };

  self.createNewUser = function (request) {

    var user = new User();

    user.fullName   = request.body.fullName;
    user.playerName = request.body.playerName;
    user.email      = request.body.email;
    user.password   = request.body.password;

    user.save( function (error) {
      if (error) {
        console.log('Error: ' + error);
        console.log('Error: occurred when trying to save newly created user.');
      }
    });

    return user;
  };

  self.authenticate = function (request, callback) {

    var email    = request.body.email;
    var password = request.body.password;

    // find the user
    User.findOne({email: email})

        .select('email fullName password')

        .exec(function(err, user) {

          if (err) { throw err;}

          // no user with that username was found
          if (!user) {
            callback({
              success: false,
              message: 'Authentication failed. User not found.'
            });
          } else if (user) {

            // check if password matches
            var validPassword = user.comparePassword(request.body.password);

            if (!validPassword) {

              callback({
                success: false,
                message: 'Authentication failed. Wrong password.'
              });

            } else {

              // if user is found and password is right
              // create a token
              var token = jwt.sign({
                name     : user.email,
                username : user.fullName
                }, superSecret);

              // return the information including token as JSON
              callback({
                success: true,
                message: 'Enjoy your token!',
                token: token
              });

            }

          }

        });

  }

}

module.exports = new UserController();
