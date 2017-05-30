const redis = require('./redis'),
	 debug = require('debug')('opensso-bridge');
	  loki  = require('./loki');

module.exports.active = function(){
	if (process.env.CLUSTER_MODE.toLowerCase()=='true'){
		debug(`Active Provider: Redis`);
		return redis;
	}
	debug(`Active Provider: Inproc(loki)`);
	return loki;
}