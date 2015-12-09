'use strict';

var mongoose = require('mongoose');
var Token = mongoose.model('Token');
var User = mongoose.model('User');
var async = require('async');

var errors = require('../errors/index.js');
var tracker = require('../helpers/tracker.js');

module.exports.get = function(req, res, next) {
  if (!req.params.token) {
    next(errors.MissingParameterError('Missing token parameter'));
  }

  async.waterfall([
    function getToken(cb) {
      Token.findOne({ token: req.params.token }, cb);
    },
    function getUser(token, cb) {
      if (!token) {
        return cb(errors.UnauthorizedError('Unauthorized'));
      }
      User.findOne({ _id: token.user }, cb);
    },
    function setUser(user, cb) {
      if (!user) {
        return cb(errors.UnauthorizedError('Unauthorized'));
      }

      if (!user.emailValidated) {
        tracker.track(req, 'validate_email', {
          distinct_id: user._id,
          userId: user._id,
          login: user.login,
          gpa: user.gpa
        });
        user.emailValidated = true;
        user.save(function(err) {
          cb(err, user);
        });
      }
      else {
        tracker.track(req, 'autologin', {
          distinct_id: user._id,
          userId: user._id,
          login: user.login,
          gpa: user.gpa
        });
        cb(null, user);
      }
    },
    function setSession(user) {
      if(!req.session) {
        req.session = {};
      }

      req.session.user = user;
      if(req.session.returnTo) {
        var returnTo = req.session.returnTo;
        req.session.returnTo = null;
        res.redirect(returnTo);
      }
      else {
        res.redirect('/');
      }
    }
  ], next);
};

