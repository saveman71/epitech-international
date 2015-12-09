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
    console.log(results[1]);
    res.render('profile', {
      user: results[1],
      universities: results[0]
    });
  });
};


module.exports.post = function(req, res, next) {
	if (!req.body.gpa || !req.body.tepitechScore || !req.body.toeflScore) {
		res.render('profile', {
      error: 'ERRORRRRRRRRRRRRRRRRR',
    });
	}

  console.log(req.body);

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
      user.gpa = req.body.gpa;
      user.tepitechScore = req.body.tepitechScore;
      user.toeflScore = req.body.toeflScore;

      [1, 2, 3, 4].forEach(function(nb) {
        if (req.body['wish' + nb]) {
          user.universities.set(nb - 1, {_id: req.body['wish' + nb]});
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
