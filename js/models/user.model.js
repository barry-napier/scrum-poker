var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
var validators = require('mongoose-validators');

var Schema   = mongoose.Schema;

UserSchema = new Schema({

  fullName : {
    type : String,
    required: true,
    trim : true
  },
  playerName : {
    type : String,
    required: true,
    trim : true
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    required: 'Email address is required',
    validate: validators.isEmail()
  },
  password : {
    type : String,
    trim : true,
    select: false,
    required: true,
    validate: validators.isLength(6, 25)
  },
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});

UserSchema.pre('save', function(next) {

  var user = this;

  // generate the hash
  bcrypt.hash(user.password, bcrypt.genSaltSync(10), function (err, hash) {

    user.password = hash;
    next();

  });

});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {

  var user = this;

  return bcrypt.compareSync(password, user.password);

};

module.exports = mongoose.model('User', UserSchema);