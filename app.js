"use strict";

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
var morgan = require('morgan');

var noWWW = require('./lib/middlewares/no-www.js');

var app = module.exports = express();

require('./config/load-app.js')(app);

mongoose.connect(app.get('mongoUrl'));

// Redirect www to no www
app.use(noWWW);
app.use(morgan('dev'));

// view engine setup
app.set('views', path.join(__dirname, 'lib/views'));
app.set('view engine', 'jade');
app.locals.moment = require('moment');

app.use(favicon('public/favicon.ico'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(session({
  secret: app.get('secret'),
  proxy: false,
  store: new MongoStore({
    url: app.get('mongoUrl')
  }, function() {}),
  saveUninitialized: true,
  resave: true
}));

require('./config/routes.js')(app);

app.use(express.static(path.join(__dirname, 'public')));


// error handler
app.use(function(err, req, res, next) {
  console.error(err);
  console.error(req.url);
  var status = err.status || err.code || 500;
  res.status(status);

  res._body = err;
  res.render('error', {
    message: "Error: " + (err.message || err.error_description),
    stacktrace: app.get('stacktraces') ? err.stack : null
  });
  next();
});

// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
  if(res.headersSent) {
    return next();
  }

  res.status(404).render('404', { status: 404, url: req.url });
});
