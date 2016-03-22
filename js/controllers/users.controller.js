var UserModel = require('../models/user.model');
var config    = require('../config/');
var logger    = config.logger;
var jwt       = require('jsonwebtoken');

/***********************************************************************************************************************
 *
 * The controller of the user information.
 *
 * @constructor
 *
 **********************************************************************************************************************/
UserController = function () {

  var self   = this,
      secret = config.secret;

  /*********************************************************************************************************************
   *
   * Creates a user.
   *
   * @param  {object}   request  - The request containing user information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.createUser = function (request, callback) {

    var result = {success : false, message : ''},
        user   = new UserModel();

    if (request.body.fullName && request.body.playerName && request.body.email && request.body.password) {

      user.fullName   = request.body.fullName;
      user.playerName = request.body.playerName;
      user.email      = request.body.email;
      user.password   = request.body.password;

      user.save( function(error) {

        if (error) {

          if (error.code == 11000) {

            result.message = 'A user with that email already exists.';

          } else {

            result.message = 'An error occurred while trying to create new user.';
            result.error = error.message;

            logger.error(error.message);

          }

        } else {

          result.success = true;
          result.message = 'User created!';
          result.userId = user._id;

        }

        return callback(result);

      });

    } else {

      result.message = 'User information is incomplete.';

      return callback(result);

    }

  };

  /*********************************************************************************************************************
   *
   * Updates data associated to an existing user.
   *
   * @param  {object}   request  - The request containing user information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.updateUser = function (request, callback) {

    var result = {success : false, message : ''};
    var userId = request.params.userId;

    if (userId) {

      UserModel.findById(userId, function (error, user) {

        if (!user) {

          result.message = 'User to update not found.';

          return callback(result);

        } else {

            if (request.body.fullName)   { user.fullName   = request.body.fullName;   }
            if (request.body.playerName) { user.playerName = request.body.playerName; }
            if (request.body.password)   { user.password   = request.body.password;   }

            user.save( function (error) {

              if (error) {

                result.message = 'An error occurred while trying to save the updated user.';
                result.error = error.message;

                logger.error(error.message);

              } else {

                result.success = true;
                result.message = 'User updated!';

              }

              return callback(result);

            });

        }

      });

    }

  };

  /*********************************************************************************************************************
   *
   * Deletes an existing user.
   *
   * @param  {object}   request  - The request containing user information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.deleteUser = function (request, callback) {

    var result = {success : false, message : ''};
    var userId = request.params.userId;

    if (userId) {

      UserModel.findByIdAndRemove(userId, {}, function(error) {

        if (error) {

          result.message = 'An error occurred while trying to delete a user.';
          result.error = error.message;

          logger.error(error.message);

        } else {

          result.success = true;
          result.message = 'User successfully deleted!';

        }

        return callback(result);

      });

    }

  };

  /*********************************************************************************************************************
   *
   * Authenticate user.
   *
   * @param  {object}   request  - The request containing user information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.authenticate = function (request, callback) {

    var result = {success : false, message : ''};

    var email    = request.body.email;
    var password = request.body.password;

    if (email && password) {

      UserModel.findOne({email: email})

          .select('email fullName password playerName')

          .exec( function(error, user) {

            if (!user) {

              result.message = 'Authentication failed. User not found.';

            } else {

              var validPassword = user.comparePassword(password);

              if (!validPassword) {

                result.message = 'Authentication failed. Password incorrect.';

              } else {

                var token = jwt.sign({ email : user.email, fullName : user.fullName}, secret);

                result.success    = true;
                result.message    = 'Authenticated!';
                result.token      = token;
                result.userId     = user._id;
                result.playerName = user.playerName;

              }

            }

            return callback(result);

          });

    }

  };

  /*********************************************************************************************************************
   *
   * Gets data associated to an existing user.
   *
   * @param  {object}   request  - The request containing user information.
   * @param  {function} callback - The callback function to execute when done processing.
   *
   * @return {object}   result   - The result of execution.
   *
   ********************************************************************************************************************/
  self.getUser = function (request, callback) {

    var result = {success : false, message : ''};
    var userId = request.params.userId;

    if (userId) {

      UserModel.findById(userId, function (error, user) {

        if (!user) {

          result.message = 'User to retrieve not found.';

        } else {

          result.success = true;
          result.message = 'User retrieved!';
          result.user    = user;

        }

        return callback(result);

      });

    }

  };

};

module.exports = new UserController();
