const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
// const { type } = require('os');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'you must have a name'],
    maxlength: [100, 'The username is too long'],
    minlength: [1, 'The username is too short']
  },

  lastName: {
    type: String,
    required: [true, 'you must have a last name'],
    maxlength: [100, 'The last name is too long'],
    minlength: [1, 'The last name is too short']
  },
  email: {
    type: String,
    unique: true,
    maxlength: [250, 'The e-mail is too long'],
    required: [true, 'Please provide an E-mail'],
    validate: [validator.isEmail, 'Please provide currect E-mail']
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'The password must contain a minimum of 8 characters '],
    maxlength: [250, 'The password must contain a miximum of 250 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, ' Please provide phone number'],
    minlength: [9, 'Phone must contain 9 digits'],
    maxlength: [20, 'Phone number can contain maximum  20 digits']
  },
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'card' }],

  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  bizChecked: {
    type: Boolean,
    default: false
  },

  imageUrl: {
    type: String,
    maxlength: [1500, 'The image Alt is too long']
  },
  imageAlt: {
    type: String,
    maxlength: [250, 'The image Alt is too long']
  },
  state: {
    type: String,
    maxlength: [250, 'The state is too long']
  },
  country: {
    type: String,
    required: true,
    maxlength: [250, 'The country is too long']
  },
  city: {
    type: String,
    required: true,
    maxlength: [250, 'The city  is too long'],
    minlength: [1, 'must contain atleat one char']
  },
  street: {
    type: String,
    required: true,
    maxlength: [250, 'The street is too long'],
    minlength: [1, 'must contain atleat one char']
  },
  houseNumber: {
    type: String,
    maxlength: [250, 'The house number is too long']
  },
  zip: {
    type: String
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  },
  photo: String,

  active: {
    type: Boolean,
    default: true
  },
  loginTrys: {
    required: true,
    type: Number,
    default: 0
  },
  userBlocked: {
    type: Boolean,
    default: false
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  userBlockedAt: Date
});

// ============================= uscerSchema methods/pre-save/validations ==========================

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only run when password is modified
  this.password = await bcrypt.hash(this.password, 12); // Hash the password with cost of 12 - (random string with 12 length )
  // this.confirmPassword = undefined; //Delete the confirm password
  next();
});

userSchema.pre('save', function(next) {
  if (!this.isModified('password' || this.isNew)) return next();
  this.passwordChangedAt = Date.now();
  next();
});

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
const User = mongoose.model('user', userSchema);

module.exports = User;
