process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./env/' + process.env.NODE_ENV);

module.exports = config;
