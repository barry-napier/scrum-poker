var express = require("express");
var app = express();
var server = require('http').createServer(app);
var config = require('./config/');
var router = require('./router/')(app);
var db = require('./database/');
var logger = config.logger;

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

module.exports = app;
