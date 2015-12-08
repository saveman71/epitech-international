'use strict';

var mongoose = require('mongoose');
var Token = mongoose.model('Token');
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
      Token.findOne({ login: req.body.login }, cb);
    },
    function setSession(user, cb) {
      if (!user) {
        return cb(errors.UnauthorizedError('Unauthorized'));
      }

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

