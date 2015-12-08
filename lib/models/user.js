'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var UserSchema = new mongoose.Schema({
  login: {
    type: String,
    trim: true,
    required: true,
    validate: /^[A-Z0-9._+-]+_[A-Z0-9.\-_]/i
  },

  gpa: {
    type: Number,
    required: true,
    min: 0,
    max: 4,
    default: 0
  },

  tepitechScore: {
    type: Number,
    required: true,
    min: 0,
    max: 990,
    default: 0
  },

  toeflScore: {
    type: Number,
    required: true,
    min: 0,
    max: 120,
    default: 0
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
    default: false
  },

  university1: {
    type: ObjectId,
    ref: 'University'
  },

  university2: {
    type: ObjectId,
    ref: 'University'
  },

  university3: {
    type: ObjectId,
    ref: 'University'
  },

  university4: {
    type: ObjectId,
    ref: 'University'
  }
});


module.exports = mongoose.model('User', UserSchema);
