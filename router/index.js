/**
 * The routes for the express application.
 * @param {Object} app the express application.
 */
module.exports = function (app) {

  app.use('/api', require('./routes/users.route'));
  app.use('/api', require('./routes/games.route'));
  app.use('/api', require('./routes/stories.route'));

};


