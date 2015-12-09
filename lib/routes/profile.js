"use strict";

var async = require('async');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var University = mongoose.model('University');
var tracker = require('../helpers/tracker.js');

module.exports.get = function(req, res, next) {
  async.parallel([
    function getUniversities(cb) {
      University.find({}, function(err, universities) {
        cb(err, universities);
      });
    },
    function getUser(cb) {
      User
      .findOne({_id: req.session.user._id})
      .populate('universities')
      .exec(function(err, user) {
        cb(err, user);
      });
    }
  ], function(err, results) {
    if (err) {
      return next(err);
    }
    res.render('profile', {
      user: results[1],
      universities: results[0]
    });
  });
};


module.exports.post = function(req, res, next) {
  async.waterfall([
    function getUser(cb) {
      User
      .findOne({_id: req.session.user._id})
      .populate('universities')
      .exec(function(err, user) {
        cb(err, user);
      });
    },
    function modifyUser(user, cb) {
      ['gpa', 'tepitechScore', 'toeflScore'].forEach(function(propertyName) {
        if (req.body[propertyName]) {
          user[propertyName] = req.body[propertyName];
        }
      });

      var wishedIds = [];
      var wishes = [1, 2, 3, 4].map(function(index) {
        if (wishedIds.indexOf(req.body['wish' + index]) === -1) {
          wishedIds.push(req.body['wish' + index]);
        }
        else {
          return undefined;
        }
        return req.body['wish' + index];
      });

      wishes.sort(); // put undefined values at the end

      wishes.forEach(function(wish, index) {
        if (wish) {
          user.universities.set(index, {_id: wish});
        }
        else {
          user.universities.splice(index, 1);
        }
      });

      tracker.track(req, 'edit_profile');

      user.save(cb);
    },
    function display() {
      res.redirect('/');
    }
  ], next);
};
