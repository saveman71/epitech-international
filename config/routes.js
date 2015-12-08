"use strict";

var autoload = require('auto-load');
var throttle = require('micron-throttle');

var lib = autoload(__dirname + '/../lib');
var routes = lib.routes;
var middlewares = lib.middlewares;

var strictThrottler = throttle({
  rate: 0.1,
  burst: 1,
  ip: true
});

module.exports = function(app) {
  app.get('/', middlewares.isAuth, routes.index.get);

  app.get('/login', routes.login.get);
  app.post('/login', strictThrottler, routes.login.post);

  app.get('/autologin/:token', routes.autologin.get);
};
