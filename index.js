require('dotenv').config();

var app = require('express')(),
	cluster = require('cluster'),
	session = require('express-session'),
	data = require('./data'),
	auth = require('./auth'),
	bodyParser = require('body-parser'),
	morgan = require('morgan'),
	debug = require('debug')('opensso-bridge');

app.use(morgan('short'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
	secret: '3232322',
	resave: true,
	saveUninitialized: false
}));

app.use('/', require('./oauth-server'));

function startServer(){
	debug('starting server...');
	var port = process.env.PORT || 1443;
	app.listen(port, function(){
		debug(`started on ${port}`);
	});
}

if (cluster.isMaster) {
	debug('setting up seed data...');
	data.setup(function(err){
		if (err){
			console.log(err);
			return;
		}
		if (process.env.CLUSTER_MODE.toLowerCase()=='true'){
			var workerCount = require('os').cpus().length;
			debug(`forking ${workerCount} workers...`);
			for (var i = 0; i < workerCount; i++) {
				cluster.fork();
			}
		}
		else{
			startServer();	
		}
	});
}
else{ 
	startServer();	
}


/*

http://localhost:1443/dialog/oauth?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2F&scope=openid%20profile&client_id=232322232232

*/