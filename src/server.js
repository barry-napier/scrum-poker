var express  = require('express'),
    logger   = require('winston'),
    mongoose = require('mongoose'),

    app      = express(),
    server   = require('http').createServer(app),

    config   = require('./config/'),
    router   = require('./router/')(app);
               require('./database/');

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});

// Routing
app.use(express.static(__dirname + '/public'));
