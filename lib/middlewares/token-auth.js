"use strict";

var app = require('../../app.js');


module.exports = function(req, res, next) {
  if(!req.query.token) {
    return next();
  }

  if(req.query.token !== app.get('intraToken')) {
    return res.render('login', {
      error: 'The token is invalid',
      token: req.body.token
    });
  }

  if(!req.session) {
    req.session = {};
  }
  var user = {
    token: app.get('intraToken')
  };
  req.session.user = user;
  next();
};
