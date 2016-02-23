var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

GameSchema = new Schema({

  name : {
    type : String,
    default : '',
    trim : true
  },
  description : {
    type : String,
    default : '',
    trim : true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Story'
  }],
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});

/* Statics */
GameSchema.statics = {

  getByUserId: function (userId, callback) {

    this.find({creator:userId})
        .populate('stories')
        .exec(function(error, docs) {
          callback(error, docs);
        });
  },

  getById: function (gameId, callback) {
    this.findById(gameId)
        .populate('stories')
        .exec(function(error, docs) {
          callback(error, docs);
        });
  }

};

module.exports = mongoose.model('Game', GameSchema);