var router = require('express').Router(),
	lib = require('../lib'),
	passport = require('passport'),
	profile = require('./profile');

router.use(passport.initialize());


router.get('/authorize',lib.authorizationGrantDirect);
router.post('/oauth/token', lib.token);

router.get('/userinfo', profile.serve);

module.exports = router;