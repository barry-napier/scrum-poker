var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,

UserSchema = new Schema({
  name : {
            type : String,
            default : '',
            trim : true
          }
});

/* Validations */
UserSchema.path('name').required(true, 'User name cannot be blank');

/* Methods */
UserSchema.methods = {};

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
  }

};

module.exports = mongoose.model('User', UserSchema);
