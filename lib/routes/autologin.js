'use strict';

var mongoose = require('mongoose');
var Token = mongoose.model('Token');
var User = mongoose.model('User');
var async = require('async');

var errors = require('../errors/index.js');

module.exports.get = function(req, res, next) {
  if (!req.params.token) {
    next(errors.MissingParameterError('Missing token parameter'));
  }

  async.waterfall([
    function getToken(cb) {
      Token.findOne({ login: req.body.login }, cb);
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
        user.emailValidated = true;
        user.save(function(err) {
          cb(err, user);
        });
      }
      else {
        cb(null, user);
      }
    },
    function setSession(user) {
      console.log(user);
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
        console.log('youhooo');
        res.redirect('/');
      }
    }
  ], next);
};

