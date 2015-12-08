'use strict';

var config = require('./index.js');

module.exports = function(app) {
  app.set('port', config.port);
  // URL for mongo access
  app.set('mongoUrl', config.mongoUrl);
  // Intra endpoint
  app.set('intraUrl', config.intraUrl);
  // Secret
  app.set('secret', config.secret);
};
