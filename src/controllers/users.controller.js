var User = require('../models/user.model'),

/**
 * The controller of the user information.
 */
UserController = function () {

  var self = this;

  /**
   * Retrieves all of the users.
   * @param  {Function} callback the callback function to hand data to.
   */
  self.getAllUsers = function (callback) {

    User.getAll( function (error, users) {

      var result;

      if (!error) {
        result = users;
      }

      callback(result);
    });

  };

  /**
   * Retrieves a user by id.
   * @param  {Function} callback the callback function to hand data to.
   */
  self.getUserById = function (id, callback) {

    User.getById(id, function (error, users) {

      var result;

      if (!error) {
        result = users;
      }

      callback(result);
    });

  };

  /**
   * Creates a new user.
   * @param  {Function} callback the callback function to hand data to.
   */
  self.createNewUser = function (request) {

    var user = new User();

    user.fullName   = request.body.fullName;
    user.playerName = request.body.playerName;
    user.email      = request.body.email;
    user.password   = request.body.password;

    user.save( function (error) {
      if (error) {
        console.log('Error: occurred when trying to save newly created user.');
      }
    });

    return user;
  };

}

module.exports = new UserController();
