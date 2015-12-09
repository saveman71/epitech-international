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
    function checkIfUserExists(cb) {
      User.findOne({ login: req.body.login }, function(err, user) {
        if (err) {
          return cb(err);
        }
        if (user) {
          return res.render('login', {
            error: 'An email was already sent to your email. Please check your email, or contact bolvy_a@epitech.eu',
          });
        }
        cb();
      });
    },
    function sendEmail(cb) {
      var user = new User({
        login: req.body.login
      });

      var token = new Token({
        user: user
      });

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

