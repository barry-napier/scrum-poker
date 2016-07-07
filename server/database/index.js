var mongoose = require('mongoose'),
    config   = require('../config/'),

    db = mongoose.connect(config.db.uri, config.db.options, function (err) {

      if (err) {
        throw err;
      } else {
        //console.log('Connected to db: ' + config.db.uri);
      }

    });

module.exports = db;
