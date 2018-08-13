var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var dateformat = require('dateformat');

//Define a schema
var Schema = mongoose.Schema;
var UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true // remove both-side white space
  },
  email: {
    type: String,
    unique: true, // unique data lik pk
    required: true,
    trim: true // remove both-side white space
  },
  password: {
    type: String,
    required: true,
    trim: true // remove both-side white space
  },
  role: {
    type: String,
    default: 'USER'
  },
  updated: {
    type: Date,
    default: Date.now
  },
  inserted: {
    type: Date,
    default: Date.now
  },
  updatedby: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  insertedby: {
    type: Schema.Types.ObjectId,
    ref: 'Users'
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
});

//hashing a password before saving it to the database
UserSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
  next();
});

UserSchema.statics.compare=function(cleartext, encrypted){
  return bcrypt.compareSync(cleartext, encrypted);
};

UserSchema.virtual('updated_date').get(function(){
  return dateformat(this.updated, 'dd/mm/yy HH:MM');
});

UserSchema.virtual('inserted_date').get(function(){
  return dateformat(this.inserted, 'dd/mm/yy HH:MM');
});

module.exports = mongoose.model('Users', UserSchema);
