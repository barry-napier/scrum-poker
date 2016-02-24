var mongoose = require('mongoose'),
    bcrypt   = require('bcrypt'),
    Schema   = mongoose.Schema,

    salt     = bcrypt.genSaltSync(10)

UserSchema = new Schema({

  fullName : {
    type : String,
    default : '',
    trim : true
  },
  playerName : {
    type : String,
    default : '',
    trim : true
  },
  email : {
    type : String,
    default : '',
    trim : true,
    index: { unique: true }
  },
  password : {
    type : String,
    default : '',
    trim : true,
    select: false,
    required: true,
    bcrypt: true
  },
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});


// hash the password before the user is saved
UserSchema.pre('save', function(next) {
  var user = this;

  // hash the password only if the password has been changed or user is new
  if (!user.isModified('password')) return next();

  // generate the hash
  bcrypt.hash(user.password, bcrypt.genSaltSync(10), function(err, hash) {

    if (err) return next(err);

    // change the password to the hashed version
    user.password = hash;
    next();
  });
});

// method to compare a given password with the database hash
UserSchema.methods.comparePassword = function(password) {
  var user = this;

  return bcrypt.compareSync(password, user.password);
};

/* Statics */
UserSchema.statics = {

  getById: function (id, callback) {
    this.findById(id, function (error, doc) {
      callback(error, doc);
    });
  }

};

module.exports = mongoose.model('User', UserSchema);