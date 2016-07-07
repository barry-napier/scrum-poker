var winston = require('winston');

module.exports = {

  logger : new (winston.Logger)({
    transports : [
      new (winston.transports.File)({filename : 'foo.log'})
    ]
  }),

  db: {
    uri: process.env.MONGOHQ_URL || process.env.MONGOLAB_URI || 'localhost:27017/test',
    options: {
      user: '',
      pass: ''
    },
    // Enable mongoose debug mode
    debug: process.env.MONGODB_DEBUG || true
  },

  port : process.env.PORT || 9000,

  ip: process.env.IP || '127.0.0.1',

  // super secret for creating tokens
  'secret': 'ilovescotchscotchyscotchscotch'

};