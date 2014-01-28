var extend = require('xtend');
var request = require('request');
var querystring = require('querystring');

var API_URL = 'https://api.digitalocean.com';

/**
 * <b>Digitalocean API Client</b>.
 * @constructor
 * @param {string}    clientID        Your account's DigitalOcean Client Id
 * @param {string}    apiKey          Your account's DigitalOcean API Key
 * @author Matěj Šimek <email@matejsimek.cz> (www.matejsimek.cz)
 */
var Digitalocean = function(clientID, apiKey) {
	this.credentials = {
		client_id: clientID,
		api_key: apiKey
	};
};
module.exports = Digitalocean;

/**
 * <b>Helper to handle requests to the API with authorization</b>.
 *
 * @private
 * @param {string}    url             address part after API root
 * @param {Object}    parameters      additional parameters
 * @callback          complete
 * @memberof Digitalocean
 * @method get
 */
Digitalocean.prototype._get = function(url, parameters, callback) {
	parameters = extend(parameters, this.credentials); // Add credentials to parameters
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
 * <b>Show All Active Droplets</b>.
 * This method returns all active droplets that are currently running in your account. All available API information is presented for each droplet.
 * @callback   complete
 * @memberof Digitalocean
 * @method dropletGetAll
 */
Digitalocean.prototype.dropletGetAll = function(callback) {
	this._get('droplets/', {}, function(error, body) {
		callback(error, body.droplets);
	});
};

/**
 * <b>New Droplet</b>.
 * This method allows you to create a new droplet. See the required parameters section below for an explanation of the variables that are needed to create a new droplet.
 * @param {string}    name            Required, this is the name of the droplet - must be formatted by hostname rules
 * @param {number}    sizeId          Required, this is the id of the size you would like the droplet created at
 * @param {number}    imageId         Required, this is the id of the image you would like the droplet created with
 * @param {number}    regionId        Required, this is the id of the region you would like your server in IE: US/Amsterdam
 * @param {Object}    optionals       { ssh_key_ids: [], private_networking: false, backups_enabled: false }
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletNew
 */
Digitalocean.prototype.dropletNew = function(name, sizeId, imageId, regionId, optionals, callback) {
	var options = {
		name: name,
		size_id: sizeId,
		image_id: imageId,
		region_id: regionId
	};
	options = extend(options, optionals);

	this._get('droplets/new', options, function(error, body) {
		callback(error, body.droplet);
	});
};

/**
 * <b>Show Droplet</b>.
 * This method returns full information for a specific droplet ID that is passed in the URL.
 * @param {number}    id              Required, this is the id of your droplet
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletGet
 */
Digitalocean.prototype.dropletGet = function(id, callback) {
	this._get('droplets/' + id, {}, function(error, body) {
		callback(error, body.droplet);
	});
};

/**
 * <b>Reboot Droplet</b>.
 * This method allows you to reboot a droplet. This is the preferred method to use if a server is not responding.
 * @param {number}    id              Required, this is the id of your droplet that you want to reboot
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletReboot
 */
Digitalocean.prototype.dropletReboot = function(id, callback) {
	this._get('droplets/' + id + '/reboot/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Power Cycle Droplet</b>.
 * This method allows you to power cycle a droplet. This will turn off the droplet and then turn it back on.
 * @param {number}    id              Required, this is the id of your droplet that you want to power cycle
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletPowerCycle
 */
Digitalocean.prototype.dropletPowerCycle = function(id, callback) {
	this._get('droplets/' + id + '/power_cycle/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Shut Down Droplet</b>.
 * This method allows you to shutdown a running droplet. The droplet will remain in your account.
 * @param {number}    id              Required, this is the id of your droplet that you want to shutdown
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletShutdown
 */
Digitalocean.prototype.dropletShutdown = function(id, callback) {
	this._get('droplets/' + id + '/shutdown/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Power Off</b>.
 * This method allows you to poweroff a running droplet. The droplet will remain in your account.
 * @param {number}    id              Required, this is the id of your droplet that you want to power off
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletPowerOff
 */
Digitalocean.prototype.dropletPowerOff = function(id, callback) {
	this._get('droplets/' + id + '/power_off/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Power On</b>.
 * This method allows you to poweron a powered off droplet.
 * @param {number}    id              Required, this is the id of your droplet that you want to power on
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletPowerOn
 */
Digitalocean.prototype.dropletPowerOn = function(id, callback) {
	this._get('droplets/' + id + '/power_on/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Reset Root Password</b>.
 * This method will reset the root password for a droplet. Please be aware that this will reboot the droplet to allow resetting the password.
 * @param {number}    id              Required, this is the id of your droplet that you want to reset password on
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletPasswordReset
 */
Digitalocean.prototype.dropletPasswordReset = function(id, callback) {
	this._get('droplets/' + id + '/password_reset/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Resize Droplet</b>.
 * This method allows you to resize a specific droplet to a different size. This will affect the number of processors and memory allocated to the droplet.
 * @param {number}    id              Required, this is the id of your droplet that you want to resize
 * @param {number}    sizeId          Required, this is the id of the size you would like the droplet to be resized to
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletResize
 */
Digitalocean.prototype.dropletResize = function(id, sizeId, callback) {
	this._get('droplets/' + id + '/resize/', {
		size_id: sizeId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * <b>Take a Snapshot</b>.
 * This method allows you to take a snapshot of the running droplet, which can later be restored or used to create a new droplet from the same image. Please be aware this may cause a reboot.
 * @param {number}    id              Required, this is the id of your droplet that you want to resize
 * @param {Object}    optionals       { name: "date/time" }
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletSnapshot
 */
Digitalocean.prototype.dropletSnapshot = function(id, optionals, callback) {
	this._get('droplets/' + id + '/snapshot/', optionals, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Restore Droplet</b>.
 * This method allows you to restore a droplet with a previous image or snapshot. This will be a mirror copy of the image or snapshot to your droplet. Be sure you have backed up any necessary information prior to restore.
 * @param {number}    id              Required, this is the id of your droplet that you want to restore
 * @param {number}    imageId         Required, this is the id of the image you would like to use to restore your droplet with
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletRestore
 */
Digitalocean.prototype.dropletRestore = function(id, imageId, callback) {
	this._get('droplets/' + id + '/restore/', {
		image_id: imageId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Rebuild Droplet</b>.
 * This method allows you to reinstall a droplet with a default image. This is useful if you want to start again but retain the same IP address for your droplet.
 * @param {number}    id              Required, this is the id of your droplet that you want to rebuild
 * @param {number}    imageId         Required, this is the id of the image you would like to use to rebuild your droplet with
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletRebuild
 */
Digitalocean.prototype.dropletRebuild = function(id, imageId, callback) {
	this._get('droplets/' + id + '/rebuild/', {
		image_id: imageId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Rename Droplet</b>.
 * This method renames the droplet to the specified name.
 * @param {number}    id              Required, this is the id of your droplet that you want to rename
 * @param {string}    name            Required, new name of the droplet
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletRename
 */
Digitalocean.prototype.dropletRename = function(id, name, callback) {
	this._get('droplets/' + id + '/rename/', {
		name: name
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Destroy Droplet</b>.
 * This method destroys one of your droplets - this is irreversible.
 * @param {number}    id              Required, this is the id of the droplet you want to destroy
 * @callback          complete
 * @memberof Digitalocean
 * @method dropletDestroy
 */
Digitalocean.prototype.dropletDestroy = function(id, callback) {
	this._get('droplets/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};


/**
 * <b>All Regions</b>.
 * This method will return all the available regions within the Digital Ocean cloud.
 * @callback    complete
 * @memberof Digitalocean
 * @method regionGetAll
 */
Digitalocean.prototype.regionGetAll = function(callback) {
	this._get('regions/', {}, function(error, body) {
		callback(error, body.regions);
	});
};

/**
 * @private
 * @param  {string}   filter   Optional, String, either "my_images" or "global"
 * @callback complete
 * @memberof Digitalocean
 * @method _images
 */
Digitalocean.prototype._images = function(filter, callback) {
	this._get('images/', {
		filter: filter
	}, function(error, body) {
		callback(error, body.images);
	});
};

/**
 * <b>All Images</b>.
 * This method returns all the available images that can be accessed by your client ID. You will have access to all public images by default, and any snapshots or backups that you have created in your own account.
 * @callback          complete
 * @memberof Digitalocean
 * @method imageGetAll
 */
Digitalocean.prototype.imageGetAll = function(callback) {
	this._images(null, callback);
};

/**
 * <b>Global images</b>.
 * This method returns all public images.
 * @callback          complete
 * @memberof Digitalocean
 * @method imageGetGlobal
 */
Digitalocean.prototype.imageGetGlobal = function(callback) {
	this._images('global', callback);
};

/**
 * <b>Mine images</b>.
 * This method returns snapshots or backups that you have created in your own account.
 * @callback          complete
 * @memberof Digitalocean
 * @method imageGetMine
 */
Digitalocean.prototype.imageGetMine = function(callback) {
	this._images('my_images', callback);
};

/**
 * <b>Show Image</b>.
 * This method displays the attributes of an image.
 * @param {number}    id              Required, this is the id of the image you would like to use to rebuild your droplet with
 * @callback          complete
 * @memberof Digitalocean
 * @method imageGet
 */
Digitalocean.prototype.imageGet = function(id, callback) {
	this._get('images/' + id + '/', {}, function(error, body) {
		callback(error, body.image);
	});
};

/**
 * <b>Destroy Image</b>.
 * This method allows you to destroy an image. There is no way to restore a deleted image so be careful and ensure your data is properly backed up.
 * @param {number}    id              Required, this is the id of the image you would like to destroy
 * @callback          complete
 * @memberof Digitalocean
 * @method imageDestroy
 */
Digitalocean.prototype.imageDestroy = function(id, callback) {
	this._get('images/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * <b>Transfer Image</b>.
 * This method allows you to transfer an image to a specified region.
 * @param {number}    id              Required, this is the id of the image you would like to transfer.
 * @param {number}    regionId        Required, this is the id of the region to which you would like to transfer.
 * @callback          complete
 * @memberof Digitalocean
 * @method imageTransfer
 */
Digitalocean.prototype.imageTransfer = function(id, regionId, callback) {
	this._get('images/' + id + '/transfer/', {
		region_id: regionId
	}, function(error, body) {
		callback(error, body.event_id);
	});
};


/**
 * <b>All SSH Keys</b>.
 * This method lists all the available public SSH keys in your account that can be added to a droplet.
 * @callback          complete
 * @memberof Digitalocean
 * @method sshKeyGetAll
 */
Digitalocean.prototype.sshKeyGetAll = function(callback) {
	this._get('ssh_keys/', {}, function(error, body) {
		callback(error, body.ssh_keys);
	});
};

/**
 * <b>Add SSH Key</b>.
 * This method allows you to add a new public SSH key to your account.
 * @param {string}    name            Required, the name you want to give this SSH key.
 * @param {string}    pubKey          Required, the actual public SSH key.
 * @callback          complete
 * @memberof Digitalocean
 * @method sshKeyAdd
 */
Digitalocean.prototype.sshKeyAdd = function(name, pubKey, callback) {
	this._get('ssh_keys/new/', {
		name: name,
		ssh_pub_key: pubKey
	}, function(error, body) {
		callback(error, body.ssh_key);
	});
};

/**
 * <b>Show SSH Key</b>.
 * This method shows a specific public SSH key in your account that can be added to a droplet.
 * @param {number}    id              Required, this is the id of the ssh key you would like to get information on.
 * @callback          complete
 * @memberof Digitalocean
 * @method sshKeyGet
 */
Digitalocean.prototype.sshKeyGet = function(id, callback) {
	this._get('ssh_keys/' + id + '/', {}, function(error, body) {
		callback(error, body.ssh_key);
	});
};

/**
 * <b>Edit SSH Key</b>.
 * This method allows you to modify an existing public SSH key in your account.
 * @param {type}      id              Required, this is the id of the ssh key you would like to edit.
 * @param {string}    pubKey          Required, the public SSH key.
 * @callback          complete
 * @memberof Digitalocean
 * @method sshKeyEdit
 */
Digitalocean.prototype.sshKeyEdit = function(id, pubKey, callback) {
	this._get('ssh_keys/' + id + '/edit/', {
		ssh_pub_key: pubKey
	}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * <b>Destroy SSH Key</b>.
 * This method will delete the SSH key from your account.
 * @param {number}    id              Required, this is the id of the ssh key you would like to destroy.
 * @callback          complete
 * @memberof Digitalocean
 * @method sshKeyDestroy
 */
Digitalocean.prototype.sshKeyDestroy = function(id, callback) {
	this._get('ssh_keys/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};


/**
 * <b>All Sizes</b>.
 * This method returns all the available sizes that can be used to create a droplet.
 * @callback    complete
 * @memberof Digitalocean
 * @method sizeGetAll
 */
Digitalocean.prototype.sizeGetAll = function(callback) {
	this._get('sizes/', {}, function(error, body) {
		callback(error, body.sizes);
	});
};


/**
 * <b>All Domains</b>.
 * This method returns all of your current domains.
 * @callback    complete
 * @memberof Digitalocean
 * @method domainGetAll
 */
Digitalocean.prototype.domainGetAll = function(callback) {
	this._get('domains/', {}, function(error, body) {
		callback(error, body.domains);
	});
};

/**
 * <b>New Domain</b>.
 * This method creates a new domain name with an A record for the specified [ip_address].
 * @param {string}    name            Required, name of the domain.
 * @param {string}    ipAddress       Required, ip address for the domain's initial a record.
 * @callback          complete
 * @memberof Digitalocean
 * @method domainNew
 */
Digitalocean.prototype.domainNew = function(name, ipAddress, callback) {
	this._get('domains/new', {
		name: name,
		ip_address: ipAddress
	}, function(error, body) {
		callback(error, body.domain);
	});
};

/**
 * <b>Domain Show</b>.
 * This method returns the specified domain.
 * @param {(number|string)} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @callback                complete
 * @memberof Digitalocean
 * @method domainGet
 */
Digitalocean.prototype.domainGet = function(id, callback) {
	this._get('domains/' + id, {}, function(error, body) {
		callback(error, body.domain);
	});
};

/**
 * <b>Destroy Domain</b>.
 * This method deletes the specified domain.
 * @param {(number|string)} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @callback                complete
 * @memberof Digitalocean
 * @method domainDestroy
 */
Digitalocean.prototype.domainDestroy = function(id, callback) {
	this._get('domains/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * <b>All Domain Records</b>.
 * This method returns all of your current domain records.
 * @param {(number|string)} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @callback                complete
 * @memberof Digitalocean
 * @method domainRecordGetAll
 */
Digitalocean.prototype.domainRecordGetAll = function(id, callback) {
	this._get('domains/' + id + '/records/', {}, function(error, body) {
		callback(error, body.records);
	});
};

/**
 * <b>New Domain Record</b>.
 * This method creates a new domain name with an A record for the specified [ip_address].
 * @param {(number|string)} id        Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {string}         recordType Required, the type of record you would like to create. 'A', 'CNAME', 'NS', 'TXT', 'MX' or 'SRV'
 * @param {string}         data       Required, this is the value of the record
 * @param {Object}         optionals  { name, priority, port, weight }<br>- name is required for 'A', 'CNAME', 'TXT' and 'SRV' records<br>- priority is required for 'SRV' and 'MX' records<br>- port is required for 'SRV' records<br>- weight is required for 'SRV' records
 * @callback               complete
 * @memberof Digitalocean
 * @method domainRecordNew
 */
Digitalocean.prototype.domainRecordNew = function(id, recordType, data, optionals, callback) {
	var options = {
		record_type: recordType,
		data: data
	};
	options = extend(options, optionals);

	this._get('domains/' + id + '/records/new', options, function(error, body) {
		callback(error, body.domain_record);
	});
};

/**
 * <b>Show Domain Record</b>.
 * This method returns the specified domain record.
 * @param {(number|string)} id         Required, Integer or Domain Name (e.g. domain.com), specifies the domain for which to retrieve a record.
 * @param {number}         recordId    Required, specifies the record_id to retrieve.
 * @callback               complete
 * @memberof Digitalocean
 * @method domainRecordGet
 */
Digitalocean.prototype.domainRecordGet = function(id, recordId, callback) {
	this._get('domains/' + id + '/records/' + recordId, {}, function(error, body) {
		callback(error, body.record);
	});
};

/**
 * <b>Edit Domain Record</b>.
 * This method edits an existing domain record.
 * @param {(number|string)} id        Required, Integer or Domain Name (e.g. domain.com), specifies the domain to display.
 * @param {number}         recordId   Required, specifies the record to update.
 * @param {string}         recordType Required, the type of record you would like to create. 'A', 'CNAME', 'NS', 'TXT', 'MX' or 'SRV'
 * @param {string}         data       Required, this is the value of the record
 * @param {Object}         optionals  { name, priority, port, weight }<br>- name is required for 'A', 'CNAME', 'TXT' and 'SRV' records<br>- priority is required for 'SRV' and 'MX' records<br>- port is required for 'SRV' records<br>- weight is required for 'SRV' records
 * @callback               complete
 * @memberof Digitalocean
 * @method domainRecordEdit
 */
Digitalocean.prototype.domainRecordEdit = function(id, recordId, recordType, data, optionals, callback) {
	var options = {
		record_type: recordType,
		data: data
	};
	options = extend(options, optionals);

	this._get('domains/' + id + '/records/' + recordId + '/edit', options, function(error, body) {
		callback(error, body.domain_record);
	});
};

/**
 * <b>Destroy Domain Record</b>.
 * This method deletes the specified domain record.
 * @param {(number|string)} id        Required, Integer or Domain Name (e.g. domain.com), specifies the domain for which to destroy a record.
 * @param {number}         recordId   Required, specifies which record to destroy.
 * @callback               complete
 * @memberof Digitalocean
 * @method domainRecordDestroy
 */
Digitalocean.prototype.domainRecordDestroy = function(id, recordId, callback) {
	this._get('domains/' + id + '/records/' + recordId + '/destroy', {}, function(error, body) {
		callback(error, body.status);
	});
};

/**
 * <b>Show event</b>.
 * This method is primarily used to report on the progress of an event by providing the percentage of completion.
 * @param {number}     id              Required, this is the id of the event you would like more information about.
 * @callback           complete
 * @memberof Digitalocean
 * @method eventGet
 */
Digitalocean.prototype.eventGet = function(id, callback) {
	this._get('events/' + id, {}, function(error, body) {
		callback(error, body.event);
	});
};
