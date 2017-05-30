var redis = require('redis'),
	async  = require('async'),
	options = require('./options');



function Profiles(){
	if (process.env.CLUSTER_MODE.toLowerCase()!='true')
		return;
	var client = redis.createClient(options);

	function key(username){
		return `profile.${username}`;
	}

	function findOne(filter, done){
		client.hgetall(key(filter.username), function(err, user){
			done(err,user);
		});
	}

	function insert(profile, cb) {
		client.hmset(key(profile.username), profile, function(err){
			if (err)
				return cb(err, null);
			cb(null, profile);
		});
	}

	function _import(profiles, done){
		var insertTasks = profiles.map(profile => function(cb) {
			insert(profile, function(err, profile){
				if (!err)
					return cb(err,null);

				cb(null, profile);
			})
		});
		async.parallel(insertTasks,function(err, results) {
			done(err, results.length)
		});
	};


	return {
		findOne,
		import: _import
	}

}

module.exports = new Profiles();
