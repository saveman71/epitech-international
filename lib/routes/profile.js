"use strict";

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.get = function(req, res, next) {

  	res.render('profile');
};
