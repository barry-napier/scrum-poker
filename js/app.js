var express = require("express");
var logger = require('winston');
var app = require("express")();
var server = require('http').createServer(app);
var config = require('./config/');
var router = require('./router/')(app);
var db = require('./database/');

app.use(express.static(__dirname + '/public'));

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

module.exports = app;
