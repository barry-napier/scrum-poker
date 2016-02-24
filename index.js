var express  = require('express'),
    logger   = require('winston'),
    mongoose = require('mongoose'),

    app      = express(),
    server   = require('http').createServer(app),

    config   = require('./config/'),
    path     = require('path'),
    router   = require('./router/')(app);
    require('./database/');

app.use(express.static(__dirname + '/public'));

// MAIN CATCHALL ROUTE ---------------
// SEND USERS TO FRONTEND ------------
// has to be registered after API ROUTES
app.get('*', function(req, res) {
  res.sendFile(path.join(__dirname + '/public/index.html'));
});

server.listen(config.port, config.ip, function () {
  logger.info('Server listening at port %d', config.port);
});
