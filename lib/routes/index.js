"use strict";


var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.get = function(req, res) {
	User.find({}).populate('universities').exec(function(err, users) {
  	res.render('index', {users: users});
	});
};
