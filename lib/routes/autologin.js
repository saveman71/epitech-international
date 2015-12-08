'use strict';

var errors = require('../errors/index.js');

module.exports.get = function(req, res, next) {
  if (!req.params.token) {
    next(errors.MissingParameterError('Missing token parameter'));
  }
};

