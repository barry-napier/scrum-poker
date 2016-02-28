'use strict';

process.env.NODE_ENV = 'test';

var config = require('../js/config/');
var mongoose = require('mongoose');
var UserModel = require('../js/models/user.model');

before(function (done) {

  function clearDB() {
    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }
    return done();
  }

  clearDB();
});


after(function (done) {
  // Clear the test database
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }
  mongoose.disconnect();
  return done();
});