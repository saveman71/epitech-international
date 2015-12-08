#!/bin/env node
'use strict';

require('../app');

var async = require('async');
var mongoose = require('mongoose');
var University = mongoose.model('University');

var universities = require('../config/universities.json');

async.eachLimit(universities, 10, function saveUniversity(university, cb) {
  University.update({name: university.name}, university, {upsert: true}, cb);
}, function(err) {
  if (err) {
    throw err;
  }
  process.exit(0);
});
