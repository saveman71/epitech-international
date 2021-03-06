'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var tracker = require('../helpers/tracker.js');

function arrayLimit(val) {
  return val.length <= 4;
}

var UserSchema = new mongoose.Schema({
  login: {
    type: String,
    trim: true,
    required: true,
    validate: /^[A-Z0-9._+-]+_[A-Z0-9.\-_]/i
  },

  gpa: {
    type: Number,
    min: 0,
    max: 4,
    default: null
  },

  tepitechScore: {
    type: Number,
    min: 0,
    max: 990,
    default: null
  },

  toeflScore: {
    type: Number,
    min: 0,
    max: 120,
    default: null
  },

  year: {
    type: Number,
    required: true,
    min: 2016,
    max: 2050,
    default: 2018
  },

  emailValidated: {
    type: Boolean,
    required: true,
    default: false
  },

  universities: {
    type: [{
      type: ObjectId,
      ref: 'University',
    }],
    validate: [arrayLimit, '{PATH} exceeds the limit of 4'],
    default: []
  },
});

UserSchema.index({login: 1});

UserSchema.post('save', function(user) {
    tracker.set(user, {
      '$name': user.login,
      '$email': user.login + '@epitech.eu',
      '$created': user._id.getTimestamp(),
      'userId': user._id.toString(),
      'gpa': user.gpa,
      'tepitechScore': user.tepitechScore,
      'toeflScore': user.toeflScore,
      'year': user.year,
      'emailValidated': user.emailValidated,
    });
  });

module.exports = mongoose.model('User', UserSchema);
