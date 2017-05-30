var db = require('../db'),
	debug = require('debug')('opensso-bridge'),
	passport = require('passport');

module.exports.serve = [
	passport.authenticate('bearer',{session: false}),
	function(req,res,next){
		debug(`profile requested for ${req.user.username}`);
		db.profiles.findOne({username: req.user.username}, function(err, profile){
			if (err)
				return res.status(500).send(err);
			debug(`returning profile for ${profile.username}`);
			res.json(profile);	
		});
	}
]