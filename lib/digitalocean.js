var extend = require('xtend');
var request = require('request');
var querystring = require('querystring');

var API_URL = 'https://api.digitalocean.com';

/**
 * Digitalocean API Client
 * @param {[String]}    clientID        Your account's DigitalOcean Client Id
 * @param {[String]}    apiKey          Your account's DigitalOcean API Key
 */
var Digitalocean = function(clientID, apiKey) {
	this.credentials = {
		client_id: clientID,
		api_key: apiKey
	};
};
module.exports = Digitalocean;

/**
 * Helper to handle requests to the API with authorization
 *
 * @param {[String]}    url             address part after API root
 * @param {[Object]}    parameters      additional parameters
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.get = function(url, parameters, callback) {
	extend(parameters, this.credentials); // Add credentials to parameters
	var getURL = API_URL + '/' + url + '?' + querystring.stringify(parameters); // Construct URL with parameters

	request.get({
		url: getURL,
		strictSSL: true,
		json: true
	}, function(error, response, body) {
		if (!error && !!body.status && body.status !== 'OK') {
			error = new Error(body.description || body.error_message);
		}
		callback(error, body || {});
	});
};

/**
 * Show All Active Droplets
 * This method returns all active droplets that are currently running in your account. All available API information is presented for each droplet.
 * @param  {Function}   callback        [description]
 */
Digitalocean.prototype.dropletGetAll = function(callback) {
	this.get('droplets/', {}, function(error, body) {
		callback(error, body.droplets);
	});
};

/**
 * New Droplet
 * This method allows you to create a new droplet. See the required parameters section below for an explanation of the variables that are needed to create a new droplet.
 * @param {[String]}    name            Required, this is the name of the droplet - must be formatted by hostname rules
 * @param {[Number]}    sizeId          Required, this is the id of the size you would like the droplet created at
 * @param {[Number]}    imageId         Required, this is the id of the image you would like the droplet created with
 * @param {[Number]}    regionId        Required, this is the id of the region you would like your server in IE: US/Amsterdam
 * @param {[Array]}     sshKeyIds       Optional, list of ssh_key_ids that you would like to be added to the server
 * @param {[Boolean]}   privateNetworking Optional, enables a private network interface if the region supports private networking
 * @param {[Boolean]}   backupsEnabled  Optional, enables a private network interface if the region supports private networking
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletNew = function(name, sizeId, imageId, regionId, sshKeyIds, privateNetworking, backupsEnabled, callback) {
	this.get('droplets/new', {
		name: name,
		size_id: sizeId,
		image_id: imageId,
		region_id: regionId,
		ssh_key_ids: sshKeyIds,
		private_networking: privateNetworking,
		backups_enabled: backupsEnabled
	}, function(error, body) {
		callback(error, body.droplet);
	});
};

/**
 * Show Droplet
 * This method returns full information for a specific droplet ID that is passed in the URL.
 * @param {[Number]}    id              Required, this is the id of your droplet
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletGet = function(id, callback) {
	this.get('droplets/' + id, {}, function(error, body) {
		callback(error, body.droplet);
	});
};

/**
 * Reboot Droplet
 * This method allows you to reboot a droplet. This is the preferred method to use if a server is not responding.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to reboot
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletReboot = function(id, callback) {
	this.get('droplets/' + id + '/reboot/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Power Cycle Droplet
 * This method allows you to power cycle a droplet. This will turn off the droplet and then turn it back on.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to power cycle
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletPowerCycle = function(id, callback) {
	this.get('droplets/' + id + '/power_cycle/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Shut Down Droplet
 * This method allows you to shutdown a running droplet. The droplet will remain in your account.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to shutdown
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletShutdown = function(id, callback) {
	this.get('droplets/' + id + '/shutdown/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Power Off
 * This method allows you to poweroff a running droplet. The droplet will remain in your account.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to power off
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletPowerOff = function(id, callback) {
	this.get('droplets/' + id + '/power_off/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Power On
 * This method allows you to poweron a powered off droplet.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to power on
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletPowerOn = function(id, callback) {
	this.get('droplets/' + id + '/power_on/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Reset Root Password
 * This method will reset the root password for a droplet. Please be aware that this will reboot the droplet to allow resetting the password.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to reset password on
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletResetRootPassword = function(id, callback) {
	this.get('droplets/' + id + '/password_reset/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Resize Droplet
 * This method allows you to resize a specific droplet to a different size. This will affect the number of processors and memory allocated to the droplet.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to resize
 * @param {[Number]}    sizeId          Required, this is the id of the size you would like the droplet to be resized to
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletResize = function(id, sizeId, callback) {
	this.get('droplets/' + id + '/resize/', {
		size_id: sizeId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Take a Snapshot
 * This method allows you to take a snapshot of the running droplet, which can later be restored or used to create a new droplet from the same image. Please be aware this may cause a reboot.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to resize
 * @param {[String]}    name            Optional, this is the name of the new snapshot you want to create. If not set, the snapshot name will default to date/time
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletSnapshot = function(id, name, callback) {
	this.get('droplets/' + id + '/snapshot/', {
		name: name
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Restore Droplet
 * This method allows you to restore a droplet with a previous image or snapshot. This will be a mirror copy of the image or snapshot to your droplet. Be sure you have backed up any necessary information prior to restore.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to restore
 * @param {[Number]}    imageId         Required, this is the id of the image you would like to use to restore your droplet with
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletRestore = function(id, imageId, callback) {
	this.get('droplets/' + id + '/restore/', {
		image_id: imageId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Rebuild Droplet
 * This method allows you to reinstall a droplet with a default image. This is useful if you want to start again but retain the same IP address for your droplet.
 * @param {[Number]}    id              Required, this is the id of your droplet that you want to rebuild
 * @param {[Number]}    imageId         Required, this is the id of the image you would like to use to rebuild your droplet with
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletRebuild = function(id, imageId, callback) {
	this.get('droplets/' + id + '/rebuild/', {
		image_id: imageId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Rename Droplet
 * This method renames the droplet to the specified name.
 * @param {[Number]}    id               Required, this is the id of your droplet that you want to rename
 * @param {[String]}    name            Required, new name of the droplet
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletRename = function(id, name, callback) {
	this.get('droplets/' + id + '/rename/', {
		name: name
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Destroy Droplet
 * This method destroys one of your droplets - this is irreversible.
 * @param {[Number]}    id              Required, this is the id of the droplet you want to destroy
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.dropletDestroy = function(id, callback) {
	this.get('droplets/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All Regions
 * This method will return all the available regions within the Digital Ocean cloud.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.regionGetAll = function(callback) {
	this.get('regions/', {}, function(error, body) {
		callback(error, body.regions);
	});
};

/**
 * All Images
 * This method returns all the available images that can be accessed by your client ID. You will have access to all public images by default, and any snapshots or backups that you have created in your own account.
 * @param {[String]}    filter          Optional, either "my_images" or "global"
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype._images = function(filter, callback) {
	this.get('images/', {
		filter: filter
	}, function(error, body) {
		callback(error, body.images);
	});
};

Digitalocean.prototype.imageGetAll = function(callback) {
	this._images(null, callback);
};

Digitalocean.prototype.imageGetGlobal = function(callback) {
	this._images('global', callback);
};

Digitalocean.prototype.imageGetMine = function(callback) {
	this._images('my_images', callback);
};

/**
 * Show Image
 * This method displays the attributes of an image.
 * @param {[Number]}    id              Required, this is the id of the image you would like to use to rebuild your droplet with
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.imageGet = function(id, callback) {
	this.get('images/' + id + '/', {}, function(error, body) {
		callback(error, body.image);
	});
};

/**
 * Destroy Image
 * This method allows you to destroy an image. There is no way to restore a deleted image so be careful and ensure your data is properly backed up.
 * @param {[Number]}    id              Required, this is the id of the image you would like to destroy
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.imageDestroy = function(id, callback) {
	this.get('images/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * Transfer Image
 * This method allows you to transfer an image to a specified region.
 * @param {[Number]}    id              Required, this is the id of the image you would like to transfer.
 * @param {[Number]}    regionId        Required, this is the id of the region to which you would like to transfer.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.imageTransfer = function(id, regionId, callback) {
	this.get('images/' + id + '/transfer/', {
		region_id: regionId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All SSH Keys
 * This method lists all the available public SSH keys in your account that can be added to a droplet.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sshKeyGetAll = function(callback) {
	this.get('ssh_keys/', {}, function(error, body) {
		callback(error, body.ssh_keys);
	});
};

/**
 * Add SSH Key
 * This method allows you to add a new public SSH key to your account.
 * @param {[String]}    name            Required, the name you want to give this SSH key.
 * @param {[String]}    pubKey          Required, the actual public SSH key.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sshKeyAdd = function(name, pubKey, callback) {
	this.get('ssh_keys/new/', {
		name: name,
		ssh_pub_key: pubKey
	}, function(error, body) {
		callback(error, body.ssh_key);
	});
};

/**
 * Show SSH Key
 * This method shows a specific public SSH key in your account that can be added to a droplet.
 * @param {[Number]}    id              Required, this is the id of the ssh key you would like to get information on.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sshKeyGet = function(id, callback) {
	this.get('ssh_keys/' + id + '/', {}, function(error, body) {
		callback(error, body.ssh_key);
	});
};

/**
 * Edit SSH Key
 * This method allows you to modify an existing public SSH key in your account.
 * @param {[type]}      id              Required, this is the id of the ssh key you would like to edit.
 * @param {[String]}    pubKey          Required, the public SSH key.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sshKeyEdit = function(id, pubKey, callback) {
	this.get('ssh_keys/' + id + '/edit/', {
		ssh_pub_key: pubKey
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Destroy SSH Key
 * This method will delete the SSH key from your account.
 * @param {[Number]}    id              Required, this is the id of the ssh key you would like to destroy.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sshKeyDestroy = function(id, callback) {
	this.get('ssh_keys/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All Sizes
 * This method returns all the available sizes that can be used to create a droplet.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.sizeGetAll = function(callback) {
	this.get('sizes/', {}, function(error, body) {
		callback(error, body.sizes);
	});
};

/**
 * All Domains
 * This method returns all of your current domains.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.domainGetAll = function(callback) {
	this.get('domains/', {}, function(error, body) {
		callback(error, body.domains);
	});
};

/**
 * New Domain
 * This method creates a new domain name with an A record for the specified [ip_address].
 * @param {[String]}    name            Required, name of the domain.
 * @param {[String]}    ipAddress       Required, ip address for the domain's initial a record.
 * @param {Function}    callback        [description]
 */
Digitalocean.prototype.domainNew = function(name, ipAddress, callback) {
	this.get('domains/new', {
		name: name,
		ip_address: ipAddress
	}, function(error, body) {
		callback(error, body.domain);
	});
};

/**
 * Domain Show
 * This method returns the specified domain.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainGet = function(id, callback) {
	this.get('domains/' + id, {}, function(error, body) {
		callback(error, body.domain);
	});
};

/**
 * Destroy Domain
 * This method deletes the specified domain.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainDestroy = function(id, callback) {
	this.get('domains/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * All Domain Records
 * This method returns all of your current domain records.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainRecordGetAll = function(id, callback) {
	this.get('domains/' + id + '/records/', {}, function(error, body) {
		callback(error, body.records);
	});
};

/**
 * New Domain Record
 * This method creates a new domain name with an A record for the specified [ip_address].
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {[String]}         recordType Required, the type of record you would like to create. 'A', 'CNAME', 'NS', 'TXT', 'MX' or 'SRV'
 * @param {[String]}         data       Required, this is the value of the record
 * @param {[String]}         name       Optional, Required for 'A', 'CNAME', 'TXT' and 'SRV' records
 * @param {[Number]}         priority   Optional, Required for 'SRV' and 'MX' records
 * @param {[Number]}         port       Optional, Required for 'SRV' records
 * @param {[Number]}         weight     Optional, Required for 'SRV' records
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainRecordNew = function(id, recordType, data, name, priority, port, weight, callback) {
	this.get('domains/' + id + '/records/new', {
		record_type: recordType,
		data: data,
		name: name,
		priority: priority,
		port: port,
		weight: weight
	}, function(error, body) {
		callback(error, body.domain_record);
	});
};

/**
 * Show Domain Record
 * This method returns the specified domain record.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain for which to retrieve a record.
 * @param {[Number]}         recordId   Required, specifies the record_id to retrieve.
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainRecordGet = function(id, recordId, callback) {
	this.get('domains/' + id + '/records/' + recordId, {}, function(error, body) {
		callback(error, body.record);
	});
};

/**
 * Edit Domain Record
 * This method edits an existing domain record.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {[Number]}         recordId   Required, specifies the record to update.
 * @param {[String]}         recordType Required, the type of record you would like to create. 'A', 'CNAME', 'NS', 'TXT', 'MX' or 'SRV'
 * @param {[String]}         data       Required, this is the value of the record
 * @param {[String]}         name       Optional, Required for 'A', 'CNAME', 'TXT' and 'SRV' records
 * @param {[Number]}         priority   Optional, Required for 'SRV' and 'MX' records
 * @param {[Number]}         port       Optional, Required for 'SRV' records
 * @param {[Number]}         weight     Optional, Required for 'SRV' records
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainRecordEdit = function(id, recordId, recordType, data, name, priority, port, weight, callback) {
	this.get('domains/' + id + '/records/' + recordId + '/edit', {
		record_type: recordType,
		data: data,
		name: name,
		priority: priority,
		port: port,
		weight: weight
	}, function(error, body) {
		callback(error, body.domain_record);
	});
};

/**
 * Destroy Domain Record
 * This method deletes the specified domain record.
 * @param {[Number, String]} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain for which to destroy a record.
 * @param {[Number]}         recordId   Required, specifies which record to destroy.
 * @param {Function}         callback   [description]
 */
Digitalocean.prototype.domainRecordDestroy = function(id, recordId, callback) {
	this.get('domains/' + id + '/records/' + recordId + '/destroy', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * Show event
 * This method is primarily used to report on the progress of an event by providing the percentage of completion.
 * @param {[Number]}     id              Required, this is the id of the event you would like more information about.
 * @param {Function}     callback        [description]
 */
Digitalocean.prototype.eventGet = function(id, callback) {
	this.get('events/' + id, {}, function(error, body) {
		callback(error, body.event);
	});
}