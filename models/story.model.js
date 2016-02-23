var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

StorySchema = new Schema({

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
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});

module.exports = mongoose.model('Story', StorySchema);