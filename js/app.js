var express = require("express"),
    logger = require('winston'),
    mongoose = require('mongoose');
var bodyParser = require('body-parser');

var app = require("express")();
server = require('http').createServer(app),

    config = require('./config/'),
    path = require('path'),
    router = require('./router/')(app);
db = require('./database/');

app.use(express.static(__dirname + '/public'));

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

module.exports.getApp = app;
