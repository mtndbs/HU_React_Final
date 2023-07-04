const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  user_id: {
    type: String,
    maxlength: 300
  },
  title: {
    type: String,
    required: [true, 'Buisness title is required'],
    minlength: [1, 'Buisness title is too short'],
    maxlength: [250, 'Buisness title can not be more then 250 letters']
  },
  email: {
    type: String,
    maxlength: [250, 'The e-mail is too long'],
    required: [true, 'Please provide an E-mail']
  },
  subTitle: {
    type: String,
    minlength: [1, 'Buisness sub title is too short'],
    maxlength: [250, 'Buisness sub title can not be more then 250 letters']
  },

  description: {
    type: String,
    maxlength: [2000, 'Buisness card can not be more then 2000 letters'],
    minlength: [9, 'Buisness name is too short']
  },
  country: {
    type: String,
    maxlength: [250, 'Buisness adress can not be more then 250 letters']
  },
  city: {
    type: String,
    maxlength: [250, 'Buisness adress can not be more then 250 letters']
  },
  state: {
    type: String,
    maxlength: [250, 'Buisness adress can not be more then 250 letters']
  },
  web: {
    type: String,
    maxlength: [1000, ' webside adreess is too long']
  },
  street: {
    type: String,
    required: true,
    maxlength: [250, 'The street is too long']
  },
  phone: {
    type: String,
    minlength: [6, 'Phone number is too short'],
    maxlength: [250, 'Phone number is too long']
    // validate: [validator.isDecimal, 'Please provide a valid phone number']
  },
  image: {
    type: String,
    maxlength: [1500, 'The image Alt is too long']
  },

  imageAlt: {
    type: String,
    maxlength: [250, 'The image Alt is too long']
  },

  houseNumber: {
    type: String,
    maxlength: [250, 'The house number is too long']
  },
  zip: {
    type: String
  },

  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],

  longitude: {
    type: Number
  },
  latitude: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Card = mongoose.model('card', cardSchema, 'cards');

module.exports = Card;
