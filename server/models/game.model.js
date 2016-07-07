var mongoose   = require('mongoose');
var validators = require('mongoose-validators');
var Schema     = mongoose.Schema;

var GameSchema = new Schema({

  name : {
    type : String,
    default : '',
    trim : true,
    validate : validators.isLength(3, 250)
  },
  duration : {
    type : String,
    default : '60',
    trim : true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  stories: [],
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});

module.exports = mongoose.model('Game', GameSchema);