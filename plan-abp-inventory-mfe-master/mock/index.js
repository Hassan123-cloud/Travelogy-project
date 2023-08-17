
var mockServer = require('node-mock-server');
var path = require('path');

mockServer({
	'restPath': path.join(__dirname, '/rest'),
	'uiPath': '/',
	'title': 'Api mock server',
	'version': 1,
	'urlBase': 'http://localhost:3200',
	'urlPath': '/rest',
	'optionsFallbackPath': path.join(__dirname + '/rest/_fallbacks/#/OPTIONS/'),
	'port': 3200,
	'contentType': 'application/json',
	'accessControlExposeHeaders': 'X-Total-Count',
	'accessControlAllowOrigin': '*',
	'accessControlAllowMethods': 'GET, POST, PUT, OPTIONS, DELETE, PATCH, HEAD',
	'accessControlAllowHeaders': 'origin, x-requested-with, content-type, Authorization',
	'accessControlAllowCredentials': 'true',
	'headers': {},
	'open': false,
	'dirName': __dirname
});
