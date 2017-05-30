'use strict'
const fake = require('./fake'),
	  debug = require('debug')('opensso-bridge'),
	  co = require('co'),
	  Promise = require('bluebird'),
	  db = require('../db');

db.users = Promise.promisifyAll(db.users);
db.profiles = Promise.promisifyAll(db.profiles);

module.exports.setup = function(done) {
	importUsers()
	.then(()=> done())
	.catch(err=>done(err));
}

function importUsers() {
	return co(function*() {
		const chunkSize = 1000;
		let remainingUsers = parseInt(process.env.MAX_USERS) || 1000;
		let chunkNumber = 0;

		while (remainingUsers / chunkSize > 0) {
			let importSize = Math.min(remainingUsers,chunkSize);
			var data = fake.generate(importSize);
			debug(`Chunk:${++chunkNumber} >> importing ${data.users.length} users & ${data.profiles.length} profiles...`);
			let uc = yield db.users.importAsync(data.users);
			let pc = yield db.profiles.importAsync(data.profiles);
			debug(`imported ${uc} users & ${pc} profiles...`);

			if (!(data.users.length===uc && data.profiles.length===pc))
				debug(`WARN: partial import only -  ${uc} users & ${pc} profiles...`);

			remainingUsers-=importSize;
		}
	});
}