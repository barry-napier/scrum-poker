/***********************************************************************************************************************
 *
 * The game.
 *
 * @constructor
 *
 **********************************************************************************************************************/
Game = function () {

  var self = this;
  var games = {};

  /*********************************************************************************************************************
   *
   * Creates the game into the cache.
   *
   * @param  {string}   gameId   - The game identifier.
   *
   * @return {object}   game     - The game object.
   *
   ********************************************************************************************************************/
  self.createGame = function (gameId) {

    var game = games[gameId] = {};
    
    game.users        = {};
    game.stories      = null;
    game.displayVotes = false;
    
    return game;

  };

  /*********************************************************************************************************************
   *
   * Adds the User to game.
   *
   * @param  {string}   gameId   - The game identifier.
   * @param  {object}   user     - The user object containing all user information.
   *
   * @return {object}   game     - The game object.
   *
   ********************************************************************************************************************/
  self.addUser = function (gameId, user) {

    var game = games[gameId];

    if (!game) {

      game = self.createGame(gameId);

    }

    game.users[user.username] = user;

    return user;

  };

};

module.exports = new Game();