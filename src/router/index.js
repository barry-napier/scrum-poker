/**
 * The routes for the express application.
 * @param {Object} app the express application.
 */
module.exports = function (app) {

  app.use('/api', require('./routes/users.route'));

};


