var mongoose = require('mongoose');

function testUtils () {

  var self = this;

  self.clearDB = function () {

    for (var i in mongoose.connection.collections) {
      mongoose.connection.collections[i].remove();
    }

  }

  return testUtils();
}