"use strict";

module.exports = function(req, res, next) {
  var protocol = 'http' + (req.connection.encrypted ? 's' : '') + '://';
  var host = req.headers.host;
  var href;

  if (!/^www\./i.test(host)) {
    return next();
  }

  host = host.replace(/^www\./i, '');
  href = protocol + host + req.url;
  res.statusCode = 301;
  res.setHeader('Location', href);
  res.write('Redirecting to ' + host + req.url + '');
  res.end();
};
