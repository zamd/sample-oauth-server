'use strict';
var redis = require('redis'),
	options = require('./options');



function Grants(){
	if (process.env.CLUSTER_MODE.toLowerCase()!='true')
		return;
	var client = redis.createClient(options);

	function key(suffix){
		return `grant.${suffix}`;
	}

	function userKey(base){
		return `${base}.user`;
	}
	function clientKey(base){
		return `${base}.client`;
	}

	function loadGrant(gkey, done){
		client.multi()
		.hgetall(gkey)
		.hgetall(userKey(gkey))
		.hgetall(clientKey(gkey))
		.exec(function(err,replies){
			if (err)
				done(err,null);
			var grant = replies[0];
			grant.user = replies[1];
			grant.client = replies[2];

			done(null, grant);
		});
	}

	function findOne(filter, done){
		if (filter.token)
		{
			client.get(key(filter.token), function(_,grantKey) {
				loadGrant(grantKey, function(err, grant){
					done(err,grant);
				});
			});
		}
		else
		{
			loadGrant(key(filter.code), function(err,grant){
				done(err,grant);
			});
		}
	}

	function update(grant, done) {
		var grantHash = {
			code: grant.code,
			redirectURI: grant.redirectURI
		};
		var userHash = grant.user;
		var clientHash = grant.client;

		var grantKey = key(grantHash.code);

		var batch = client.multi();
		batch.
		hmset(grantKey,grantHash).
		hmset(userKey(grantKey), userHash).
		hmset(clientKey(grantKey),clientHash);

		// auto-expire grants after 30 seconds
		const ttl = parseInt(process.env.GrantTTL || 30);
		batch.expire(grantKey, ttl);
		batch.expire(userKey(grantKey), ttl);
		batch.expire(clientKey(grantKey), ttl);

		if (grant.token){
			batch.hset(grantKey, 'token',grant.token);
			batch.set(key(grant.token), grantKey); // store foreign key...

			batch.expire(key(grant.token), ttl);
		}
		batch
		.exec(function(err, replies){
			if (err)
				return done(err, null);

			done(null, grant);
		})
	}

	return {
		update,
		insert: update,
		findOne
	}
}

module.exports = new Grants();
