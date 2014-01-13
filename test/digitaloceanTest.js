var fs = require('fs');
var path = require('path');
var config = JSON.parse(fs.readFileSync(path.normalize(__dirname + '/config.json', 'utf8')));

describe('DigitalOcean API', function() {
	var Digitalocean = require('../lib/digitalocean');
	var api = new Digitalocean(config.clientId, config.apiKey);

	describe('Droplet test', function() {
		it('should get all droplets', function(done) {
			api.dropletGetAll(done);
		});
	});
	
	describe('Region test', function() {    
		it('should get all regions', function(done) {
			api.regionGetAll(done);
		});
		
	});
	
	describe('Image test', function() {    
		it('should get all images', function(done) {
			this.timeout(8000);
			api.imageGetAll(done);
		});
		
		it('should get global images', function(done) {
			this.timeout(8000);
			api.imageGetGlobal(done);
		});
		
		it('should get my images', function(done) {
			api.imageGetMine(done);
		});
	});
	
	describe('SSH test', function() {    
		it('should get all sshKeys', function(done) {
			api.sshKeyGetAll(done);
		});
	});
	
	describe('Size test', function() {    
		it('should get all sizes', function(done) {
			api.sizeGetAll(done);
		});
	});
	
	describe('Domain test', function() {    
		it('should get all domains', function(done) {
			api.domainGetAll(done);
		});
	});
});