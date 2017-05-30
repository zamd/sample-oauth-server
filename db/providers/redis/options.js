const options  = {
	host:  process.env.REDIS_HOST,
	port: process.env.REDIS_PORT || 6379
}; 

if (process.env.REDIS_AUTH_KEY)
	options.auth_pass = process.env.REDIS_AUTH_KEY;

module.exports = options;