'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var ObjectId = mongoose.Schema.Types.ObjectId;

function defaultToken() {
  return crypto.randomBytes(32).toString('hex');
}

var TokenSchema = new mongoose.Schema({
  token: {
    type: String,
    trim: true,
    required: true,
    default: defaultToken
  },

  user: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
});

TokenSchema.index({token: 1});

module.exports = mongoose.model('Token', TokenSchema);
