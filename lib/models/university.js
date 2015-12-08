'use strict';

var mongoose = require('mongoose');

var UniversitySchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },

  deptName: {
    type: String,
    trim: true,
    required: true
  },

  language: {
    type: String,
    trim: true,
    required: true
  },

  diploma: {
    type: String,
    trim: true,
    required: true
  },

  city: {
    type: String,
    trim: true,
    required: true
  },

  country: {
    type: String,
    trim: true,
    required: true
  },

  slots: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
});


module.exports = mongoose.model('University', UniversitySchema);
