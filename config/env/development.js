'use strict';

module.exports = {

  db: {
    uri: process.env.MONGOHQ_URL ||
         process.env.MONGOLAB_URI ||
         'localhost:27017/scrum-poker',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || true
  },

  port: process.env.PORT || 3000,

  ip: process.env.IP   || '127.0.0.1',

  // super secret for creating tokens
  'secret': 'ilovescotchscotchyscotchscotch'

};
