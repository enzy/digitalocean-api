var extend = require('xtend');
var request = require('request');
var querystring = require('querystring');

var API_URL = 'https://api.digitalocean.com';

/**
 * Digitalocean API Client
 * @param {[type]} clientID [description]
 * @param {[type]} apiKey   [description]
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
 * @param  {[String]}   url        address part after API root
 * @param  {[Object]}   parameters additional parameters
 * @param  {Function} callback   [description]
 */
Digitalocean.prototype.get = function(url, parameters, callback) {
	extend(parameters, this.credentials); // Add credentials to parameters
	var getURL = API_URL + '/' + url + '?' + querystring.stringify(parameters); // Construct URL with parameters

	request.get({
		url: getURL,
		strictSSL: true,
		json: true
	}, function(error, response, body) {
			if(!error && !!body.status && body.status !== 'OK'){
				error = new Error(body.description || body.error_message);
			}

			callback(error, body || {});
		}
	);
};

/**
 * Show All Active Droplets
 * This method returns all active droplets that are currently running in your account. All available API information is presented for each droplet.
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletGetAll = function(callback) {
	this.get('droplets/', {}, function(error, body) {
		callback(error, body.droplets);
	});
};
/**
 * Show Droplet
 * This method returns full information for a specific droplet ID that is passed in the URL.
 * @param  {[Number]}   id [description]
 * @param  {Function} callback  [description]
 */
Digitalocean.prototype.dropletGet = function(id, callback) {
	this.get('droplets/' + id, {}, function(error, body) {
		callback(error, body.droplet);
	});
};
/**
 * New Droplet
 * This method allows you to create a new droplet. See the required parameters section below for an explanation of the variables that are needed to create a new droplet.
 * @param  {[String]}   name     Required, this is the name of the droplet - must be formatted by hostname rules
 * @param  {[Number]}   sizeId   Required, this is the id of the size you would like the droplet created at
 * @param  {[Number]}   imageId  Required, this is the id of the image you would like the droplet created with
 * @param  {[Number]}   regionId Required, this is the id of the region you would like your server in IE: US/Amsterdam
 * @param  {[Array]}   sshKeyIds Optional, list of ssh_key_ids that you would like to be added to the server
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletNew = function(name, sizeId, imageId, regionId, sshKeyIds, callback) {
	this.get('droplets/new', {name: name, size_id: sizeId, image_id: imageId, region_id: regionId, ssh_key_ids: sshKeyIds}, function(error, body) {
		callback(error, body.droplet);
	});
};
/**
 * Reboot Droplet
 * This method allows you to reboot a droplet. This is the preferred method to use if a server is not responding.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletRebootHard = function(id, callback) {
	this.get('droplets/' + id + '/reboot/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Power Cycle Droplet
 * This method allows you to power cycle a droplet. This will turn off the droplet and then turn it back on.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletPowerCycle = function(id, callback) {
	this.get('droplets/' + id + '/power_cycle/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Shut Down Droplet
 * This method allows you to shutdown a running droplet. The droplet will remain in your account.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletShutdown = function(id, callback) {
	this.get('droplets/' + id + '/shutdown/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Power Off
 * This method allows you to poweroff a running droplet. The droplet will remain in your account.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletPowerOff = function(id, callback) {
	this.get('droplets/' + id + '/power_off/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Power On
 * This method allows you to poweron a powered off droplet.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletPowerOn = function(id, callback) {
	this.get('droplets/' + id + '/power_on/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Reset Root Password
 * This method will reset the root password for a droplet. Please be aware that this will reboot the droplet to allow resetting the password.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletResetRootPassword = function(id, callback) {
	this.get('droplets/' + id + '/password_reset/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Resize Droplet
 * This method allows you to resize a specific droplet to a different size. This will affect the number of processors and memory allocated to the droplet.
 * @param  {[type]}   id       [description]
 * @param  {[type]}   sizeId       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletResize = function(id, sizeId, callback) {
	this.get('droplets/' + id + '/resize/', {size_id: sizeId}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Take a Snapshot
 * This method allows you to take a snapshot of the running droplet, which can later be restored or used to create a new droplet from the same image. Please be aware this may cause a reboot.
 * @param  {[type]}   id       [description]
 * @param  {[type]}   name     [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletSnapshot = function(id, name, callback) {
	this.get('droplets/' + id + '/snapshot/', {name: name}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * Restore Droplet
 *This method allows you to restore a droplet with a previous image or snapshot. This will be a mirror copy of the image or snapshot to your droplet. Be sure you have backed up any necessary information prior to restore.
 * @param  {[type]}   id       [description]
 * @param  {[type]}   imageId  [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletRestore = function(id, imageId, callback) {
	this.get('droplets/' + id + '/restore/', {image_id: imageId}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Rebuild Droplet
 * This method allows you to reinstall a droplet with a default image. This is useful if you want to start again but retain the same IP address for your droplet.
 * @param  {[type]}   id       [description]
 * @param  {[type]}   imageId  [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletRebuild = function(id, imageId, callback) {
	this.get('droplets/' + id + '/rebuild/', {image_id: imageId}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Enable Automatic Backups
 * This method enables automatic backups which run in the background daily to backup your droplet's data.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletBackupEnable = function(id, callback) {
	this.get('droplets/' + id + '/enable_backups/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Disable Automatic Backups
 * This method disables automatic backups from running to backup your droplet's data.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletBackupDisable = function(id, callback) {
	this.get('droplets/' + id + '/disable_backups/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Destroy Droplet
 * This method destroys one of your droplets - this is irreversible.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.dropletDestroy = function(id, callback) {
	this.get('droplets/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All Regions
 * This method will return all the available regions within the Digital Ocean cloud.
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.regionGetAll = function(callback) {
	this.get('regions/', {}, function(error, body) {
		callback(error, body.regions);
	});
};

/**
 * All Images
 * This method returns all the available images that can be accessed by your client ID. You will have access to all public images by default, and any snapshots or backups that you have created in your own account.
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.imageGetAll = function(callback) {
	this.get('images/', {}, function(error, body) {
		callback(error, body.images);
	});
};
Digitalocean.prototype.imageGetGlobal = function(callback) {
	this.get('images/', {filter: 'global'}, function(error, body) {
		callback(error, body.images);
	});
};
Digitalocean.prototype.imageGetMine = function(callback) {
	this.get('images/', {filter: 'my_images'}, function(error, body) {
		callback(error, body.images);
	});
};

/**
 * Show Image
 * This method displays the attributes of an image.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.imageGet = function(id, callback) {
	this.get('images/' + id + '/', {}, function(error, body) {
		callback(error, body.image);
	});
};
/**
 * Destroy Image
 * This method allows you to destroy an image. There is no way to restore a deleted image so be careful and ensure your data is properly backed up.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.imageDestroy = function(id, callback) {
	this.get('images/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All SSH Keys
 * This method lists all the available public SSH keys in your account that can be added to a droplet.
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sshKeyGetAll = function(callback) {
	this.get('ssh_keys/', {}, function(error, body) {
		callback(error, body.ssh_keys);
	});
};
/**
 * Show SSH Key
 * This method shows a specific public SSH key in your account that can be added to a droplet.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sshKeyGet = function(id, callback) {
	this.get('ssh_keys/' + id + '/', {}, function(error, body) {
		callback(error, body.ssh_key);
	});
};
/**
 * Add SSH Key
 * This method allows you to add a new public SSH key to your account.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sshKeyAdd = function(name, pubKey, callback) {
	this.get('ssh_keys/new/', {name: name, ssh_pub_key: pubKey}, function(error, body) {
		callback(error, body.ssh_key);
	});
};
/**
 * Edit SSH Key
 * This method allows you to modify an existing public SSH key in your account.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sshKeyEdit = function(id, pubKey, callback) {
	this.get('ssh_keys/' + id + '/edit/', {ssh_pub_key: pubKey}, function(error, body) {
		callback(error, body.event_id);
	});
};
/**
 * Destroy SSH Key
 * This method will delete the SSH key from your account.
 * @param  {[type]}   id       [description]
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sshKeyDestroy = function(id, callback) {
	this.get('ssh_keys/' + id + '/destroy/', {}, function(error, body) {
		callback(error, body.event_id);
	});
};

/**
 * All Sizes
 * This method returns all the available sizes that can be used to create a droplet.
 * @param  {Function} callback [description]
 */
Digitalocean.prototype.sizeGetAll = function(callback) {
	this.get('sizes/', {}, function(error, body) {
		callback(error, body.sizes);
	});
};