#!/bin/env node
'use strict';

/**
 * WARNING
 *
 *  Every time you run this, you will create new universities with new ids. Will break everything !
 *
 * WARNING
 */

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
