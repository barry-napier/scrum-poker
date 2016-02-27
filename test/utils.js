'use strict';

process.env.NODE_ENV = 'test';

var config = require('../js/config/');
var mongoose = require('mongoose');
//
//function clearDB() {
//  for (var i in mongoose.connection.collections) {
//    mongoose.connection.collections[i].remove();
//  }
//  return done();
//}
//
//
//function reconnect() {
//  mongoose.connect(config.db.test, function (err) {
//    if (err) {
//      throw err;
//    }
//    return clearDB();
//  });
//}
//
//
//function checkState() {
//  switch (mongoose.connection.readyState) {
//    case 0:
//      reconnect();
//      break;
//    case 1:
//      clearDB();
//      break;
//    default:
//      process.nextTick(checkState);
//  }
//}
//
//
//checkState();
//
//before(function (done) {
//
//});
//
//
before(function (done) {
  return done();
});


after(function (done) {
  // Clear the test database
  for (var i in mongoose.connection.collections) {
    mongoose.connection.collections[i].remove();
  }
  mongoose.disconnect();
  return done();
});