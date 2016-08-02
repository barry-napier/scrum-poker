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
  started : {
    type : Boolean,
    default : false
  },
  players:{},
  stories: {},
  currentStory : {
    type : String,
    default : ''
  },
  currentStoryIndex : {
    type: Number,
    default : 0
  },
  numOfPlayers : {
    type: Number,
    min: 0
  },
  numOfStories : {
    type: Number,
    min: 0
  },
  duration : {
    type : String,
    default : '60',
    trim : true
  },
  timer : {
    type: Number,
    min: 0
  },
  results :[],
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

}, { minimize: false });

module.exports = mongoose.model('Game', GameSchema);