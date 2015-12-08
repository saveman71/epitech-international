"use strict";

/**
 * Checks user's authentication state
 */
module.exports = function(req, res, next) {
  if(req.session.user && req.session.user.token) {
    res.locals.user = req.session.user;
    return next();
  }

  req.session.returnTo = req.originalUrl;
  res.redirect('/login');
};
