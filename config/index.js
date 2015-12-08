"use strict";

// Load env with dotenv from .env file
var dotenv = require('dotenv');
dotenv.load({silent: true});

// node_env can either be "development", "production" or "test"
var nodeEnv = process.env.NODE_ENV || "development";

var port = process.env.PORT || 3000;

// URL for mongo access
var mongoUrl = process.env.MONGOLAB_URI ||
               process.env.MONGO_URL || "mongodb://localhost/epitech-international-" + nodeEnv;

// Secret
var secret = process.env.SECRET || 'datSuperSecret42';

// Mailgun
var mailgunApiKey = process.env.MAILGUN_API_KEY;
var mailgunDomain = process.env.MAILGUN_DOMAIN;

var appUrl = process.env.APP_URL;

if (!appUrl) {
  throw (new Error('APP_URL is a mandatory env var'));
}

module.exports = {
  port: port,
  // URL for mongo access
  mongoUrl: mongoUrl,
  // Secret
  secret: secret,
  // Mailgun api key
  mailgunApiKey: mailgunApiKey,
  mailgunDomain: mailgunDomain,
  // App url
  appUrl: appUrl
};
