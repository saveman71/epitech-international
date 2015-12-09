#!/bin/env node
'use strict';

require('../app');

var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var University = mongoose.model('University');
var toHash = require('../lib/helpers/to-hash.js');

var rows = require('../config/import.json');

University.find({}, function(err, universities) {
  var hashed = toHash(universities, 'name');

  console.log(hashed);

  async.eachLimit(rows, 10, function save(row, cb) {
    row.universities = row.universities.map(function(universityName) {
      if (!hashed[universityName]) {
        console.log(universityName);
        return universityName;
      }
      return hashed[universityName]._id;
    });

    row.universities = row.universities.filter(function(universityId) {
      return universityId !== '';
    });
    console.log(row);

    User.update({login: row.login}, row, {upsert: true}, cb);
  }, function(err) {
    if (err) {
      throw err;
    }
    console.log('finished');
  });

});

