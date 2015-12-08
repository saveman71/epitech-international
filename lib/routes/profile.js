"use strict";

var mongoose = require('mongoose');
var User = mongoose.model('User');

module.exports.get = function(req, res) {
  	res.render('profile');
};


module.exports.post = function(req, res, next) {
	if (!req.body.gpa || !req.body.tepitechScore || !req.body.toeflScore)
	{
		res.render('profile', {
	      error: 'ERRORRRRRRRRRRRRRRRRR',
	    });
	}

	var user = new User(req.session.user);

	user.gpa = req.body.gpa;
	user.tepitechScore = req.body.tepitechScore;
	user.toeflScore = req.body.toeflScore;
	console.log(user);
	User.update({'_id': user._id}, user, function(err) {
		console.log(arguments);
		if (err) {
			next(err);
			return;
		}

		req.session.user = user;
		res.locals.user = user;
		res.render('profile');
	});
}