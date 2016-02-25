var UserModel = require('../models/user.model');
var config    = require('../config/');
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

    var result = { success: false, code: '', message: '' },
        user   = new UserModel();

    if (request.body.fullName && request.body.playerName && request.body.email && request.body.password) {

      user.fullName   = request.body.fullName;
      user.playerName = request.body.playerName;
      user.email      = request.body.email;
      user.password   = request.body.password;

      user.save( function(error) {

        if (error) {

          if (error.code == 11000) {

            result.code    = 'u10002';
            result.message = 'A user with that email already exists.';

          } else {

            result.code    = 'u10003';
            result.message = 'An error occurred while trying to create new user.';

          }

        } else {

          result.success = true;
          result.code    = 'u10005';
          result.message = 'User created!';
          result.userId = user._id;

        }

        return callback(result);

      });

    } else {

      result.code    = 'u10001';
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

    var result = { success: false, code: '', message: '' };
    var userId = request.params.userId;

    if (userId) {

      UserModel.findById(userId, function (error, user) {

        if (error) {

          result.code    = 'u10006';
          result.message = 'An error occurred while trying to update user information.';

          return callback(result);

        } else if (!user) {

          result.code    = 'u10007';
          result.message = 'User to update not found.';

          return callback(result);

        } else {

            if (request.body.fullName)   { user.fullName   = request.body.fullName;   }
            if (request.body.playerName) { user.playerName = request.body.playerName; }
            if (request.body.password)   { user.password   = request.body.password;   }

            user.save( function (error) {

              if (error) {

                result.code    = 'u10008';
                result.message = 'An error occurred while trying to save the updated user.';

              } else {

                result.success = true;
                result.code    = 'u10009';
                result.message = 'User updated!';

              }

              return callback(result);

            });

        }

      });

    } else {

      result.code    = 'u100010';
      result.message = 'User id not provided during update.';

      return callback(result);

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

    var result = { success: false, code: '', message: '' };
    var userId = request.params.userId;

    if (userId) {

      UserModel.findByIdAndRemove(userId, {}, function(error) {

        if (error) {

          result.code    = 'u10012';
          result.message = 'An error occurred while trying to delete a user.';

        } else {

          result.success = true;
          result.code    = 'u10013';
          result.message = 'User successfully deleted!';

        }

        return callback(result);

      });

    } else {

      result.code    = 'u10011';
      result.message = 'User id not provided during delete.';

      return callback(result);

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

    var result = { success: false, code: '', message: '' };

    var email    = request.body.email;
    var password = request.body.password;

    if (email && password) {

      UserModel.findOne({email: email})

          .select('email fullName password')

          .exec( function(error, user) {

            if (error) {

              result.code    = 'u10015';
              result.message = 'An error occurred while trying to authenticate a user.';

            } else {

              if (!user) {

                result.code    = 'u10016';
                result.message = 'Authentication failed. User not found.';

              } else {

                var validPassword = user.comparePassword(password);

                if (!validPassword) {

                  result.code    = 'u10017';
                  result.message = 'Authentication failed. Password incorrect.';

                } else {

                  var token = jwt.sign({ email : user.email, fullName : user.fullName}, secret);

                  result.success = true;
                  result.code    = 'u10018';
                  result.message = 'Authenticated!';
                  result.token   = token;

                }

              }

            }

            return callback(result);

          });

    } else {

      result.code    = 'u10014';
      result.message = 'User authentication data not provided.';

      return callback(result);

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

    var result = { success: false, code: '', message: '' };
    var userId = request.params.userId;

    if (userId) {

      UserModel.findById(userId, function (error, user) {

        if (error) {

          result.code    = 'u10020';
          result.message = 'An error occurred while trying to retrieve user information.';

        } else if (!user) {

          result.code    = 'u10021';
          result.message = 'User to retrieve not found.';

        } else {

          result.success = true;
          result.code    = 'u10022';
          result.message = 'User retrieved!';
          result.user    = user;

        }

        return callback(result);

      });

    } else {

      result.code    = 'u100019';
      result.message = 'User id not provided during retrieval.';

      return callback(result);

    }

  };

};

module.exports = new UserController();
