var loki = require('lokijs'),
	Provider = require('./providerify'),
	db = new loki();

const profiles = db.addCollection('profiles');
const users = db.addCollection('users');
const grants = db.addCollection('grants');

grants.ensureIndex("code");
grants.ensureIndex("token");
profiles.ensureIndex("username");

module.exports.users = new Provider(users);
module.exports.profiles = new Provider(profiles, true);
module.exports.grants = new Provider(grants);



