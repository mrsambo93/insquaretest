// auth.js

// Expose our config directly to our application using module.exports
module.exports = {
	'facebookAuth' : {
		'clientID' : '788732854583239', // App ID 
		'clientSecret' : 'b068cd8bc485a867616282068380a8d0',
		'callbackURL' : 'http://localhost:8080/auth/facebook/callback'
	},
	'twitterAuth' :
	{
		'consumerKey' : 'f6i6lUCCxSY0PhSBRrTQ3poKI',
		'consumerSecret' : 'p5wMA4OcHZh7plkxGZ4E6sTk4NDwAftDMExA0eoFCkhy4TgzBo',
		'callbackURL' : 'http://localhost:8080/auth/twitter/callback'
	},
	'googleAuth':
	{
		'clientID' : '1090104122107-3hjb9ah5f2ct3t0eo1a0chmncdm4aqtd.apps.googleusercontent.com',
		'clientSecret' : 'EU8AVSHQNNejryL8yoG4QFgX',
		'callbackURL' : 'http://localhost:8080/auth/google/callback'	
	}
};