"use strict";

// Load env with dotenv from .env file
var dotenv = require('dotenv');
dotenv.load();

// node_env can either be "development", "production" or "test"
var nodeEnv = process.env.NODE_ENV || "development";

var port = process.env.PORT || 3000;

// URL for mongo access
var mongoUrl = process.env.MONGOLAB_URI ||
               process.env.MONGO_URL || "mongodb://localhost/epitech-international-" + nodeEnv;

// Intra token
if(!process.env.INTRA_TOKEN) {
  console.error('INTRA_TOKEN must be set');
  process.exit(1);
}

// Secret
var secret = process.env.SECRET || 'datSuperSecret42';

module.exports = {
  port: port,
  // URL for mongo access
  mongoUrl: mongoUrl,
  // Secret
  secret: secret
};
