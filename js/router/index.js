var express = require('express');
var path = require('path');

/**
 * The routes for the express application.
 * @param {Object} app the express application.
 */
module.exports = function (app) {

  var result = {success : false, message : 'Route not defined.'};

  app.use('/api', require('./routes/users.route'));
  app.use('/api', require('./routes/games.route'));
  app.use('/api', require('./routes/stories.route'));

  app.use(express.static(__dirname + '../../../public'));

  app.get('/', function (req, res) {
    res.sendfile(__dirname + '../../../public/index.html');
  });

  app.use('/*', function (request, response) {
    response.json(result);
  });

};


