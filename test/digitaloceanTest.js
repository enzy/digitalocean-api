var fs = require('fs');
var path = require('path');

var config = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.js', 'utf8')));

describe('DigitalOcean API Wrapper', function() {
	var Digitalocean = require('../lib/digitalocean');
	var api = new Digitalocean(config.clientId, config.apiKey);

	describe('connection test', function() {

		it('should get all droplets', function(done) {
			api.dropletGetAll(done);
		});
		
		it('should get all regions', function(done) {
			api.regionGetAll(done);
		});
		
		it('should get all images', function(done) {
			api.images(null, done);
		});
		
		it('should get all images again', function(done) {
			api.imageGetAll(done);
		});
		
		it('should get global images', function(done) {
			api.imageGetGlobal(done);
		});
		
		it('should get my images', function(done) {
			api.imageGetMine(done);
		});
		
		it('should get all sshKeys', function(done) {
			api.sshKeyGetAll(done);
		});
		
		it('should get all sizes', function(done) {
			api.sizeGetAll(done);
		});
		
		it('should get all domains', function(done) {
			api.domainGetAll(done);
		});
	});
});


