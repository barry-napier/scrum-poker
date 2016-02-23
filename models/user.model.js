var mongoose         = require('mongoose'),
    Schema           = mongoose.Schema,
    bcrypt           = require('bcrypt'),
    SALT_WORK_FACTOR = 10;

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
    select: false
  },
  created : {
    type : Date,
    default : Date.now,
    select: false
  }

});

UserSchema.pre('save', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });

});

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

/* Statics */
UserSchema.statics = {

  /**
   * Get all.
   * @param  {Function} callback function executed after execution.
   */
  getAll: function (callback) {
    this.find({}, function (error, docs) {
      callback(error, docs);
    });
  },

  getById: function (id, callback) {
    this.findById(id, function (error, doc) {
      callback(error, doc);
    });
  }

};

module.exports = mongoose.model('User', UserSchema);