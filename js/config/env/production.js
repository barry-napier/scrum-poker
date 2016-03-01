var winston = require('winston');

module.exports = {

  logger : new (winston.Logger)({
    transports : [
      new (winston.transports.File)({filename : 'foo.log'})
    ]
  }),

  db: {
    uri: process.env.MONGOLAB_URI,
    // Enable mongoose debug mode
    debug: false
  },

  port : process.env.PORT,

  ip: process.env.IP,

  // super secret for creating tokens
  'secret': process.env.SECRET

};