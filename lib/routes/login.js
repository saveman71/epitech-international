"use strict";

var mongoose = require('mongoose');
var async = require('async');
var Token = mongoose.model('Token');
var User = mongoose.model('User');

var config = require('../../config/index.js');
var validLogins = require('../../config/logins.json');
var mailgun = require('mailgun-js')(
  { apiKey: config.mailgunApiKey, domain: config.mailgunDomain }
);

module.exports.get = function(req, res) {
  if (req.session.user && req.session.user.login) {
    res.redirect('/');
    return;
  }
  res.render('login');
};

module.exports.post = function(req, res, next) {
  if(!req.body.login) {
    return res.render('login', {
      error: 'Please specify a login',
    });
  }

  if(validLogins.indexOf(req.body.login) === -1) {
    return res.render('login', {
      error: 'Please specify a correct login (2018 promotion)',
    });
  }

  async.waterfall([
    function getUser(cb) {
      User.findOne({login: req.body.login}, cb);
    },
    function checkIfTokenExists(user, cb) {
      if (!user) {
        return cb(null, null, null);
      }
      Token.findOne({ user: user }, function(err, token) {
        cb(err, user, token);
      });
    },
    function sendEmail(user, token, cb) {
      if (!user) {
        user = new User({
          login: req.body.login
        });
      }

      if (!token) {
        token = new Token({
          user: user
        });
      }
      else if (token.sentCount >= 2) {
        return res.render('login', {
          error: 'A token was already sent twice to this email.\n' +
                 'To prevent spam I have therefore deactivated further email sending to this email.\n' +
                 'Please check your email, or contact bolvy_a@epitech.eu if you have trouble logging in.\n',
        });
      }

      var link = config.appUrl + '/autologin/' + token.token;
      var data = {
        from: 'Welcome <mailgun@' + config.mailgunDomain + '>',
        to: user.login + '@epitech.eu',
        subject: 'Here is your login link',
        text: 'Hello,\n\n Click this link to access the website (permanent validity)\n\n' + link
      };

      mailgun.messages().send(data, function(err) {
        if (err) {
          return cb(err);
        }
        async.parallel([
          function saveUser(cb) {
            user.save(cb);
          },
          function saveToken(cb) {
            token.sentCount += 1;
            token.save(cb);
          }
        ], function(err) {
          cb(err, user);
        });
      });
    },
    function display(user) {
      res.render('login', {
        success: 'You should get an email with a link inside (sent at ' + user.login + '@epitech.eu)'
      });
    }
  ], next);
};

