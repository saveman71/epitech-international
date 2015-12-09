'use strict';

var tracker = require('../helpers/tracker.js');

module.exports = function(req, res, next) {
  tracker.track(req, 'pageview', {
    url: req.originalUrl
  });
  next();
};
