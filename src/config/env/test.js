'use strict';

module.exports = {

  db: {
    uri: process.env.MONGOHQ_URL ||
         process.env.MONGOLAB_URI ||
         'mongodb://ds035310.mongolab.com:35310/start',
    options: {
      user: 'user',
      pass: 'pass'
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || true
  },

  port: process.env.PORT || 3000,

  ip: process.env.IP   || '127.0.0.1'

};
