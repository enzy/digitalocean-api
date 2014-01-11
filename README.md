# digitalocean-api

The digitalocean-api is a module that allows you to communicate with the [DigitalOcean API](https://www.digitalocean.com/api) from node.js

## Installation

This module is published in NPM:

```
npm install digitalocean-api --save
```

The `--save` tells NPM to automatically add it to your `package.json` file

## Usage

```js
// Import a module
var DigitalOceanAPI = require('digitalocean-api');
// Create an instance with your API credentials
var api = new DigitalOceanAPI('client_id', 'api_key');

// Get things done
api.dropletGetAll(function(error, droplets){
	console.log(droplets);
});

```

## Methods

All methods follow the [official API documentation](https://www.digitalocean.com/api).

Convention for callback arguments: `callback(error, data)`

### Droplets

```js
dropletGetAll(callback)
dropletGet(id, callback)
dropletNew(name, sizeId, imageId, regionId, sshKeyIds, callback)
dropletRebootHard(id, callback)
dropletPowerCycle(id, callback)
dropletShutdown(id, callback)
dropletPowerOff(id, callback)
dropletPowerOn(id, callback)
dropletResetRootPassword(id, callback)
dropletResize(id, sizeId, callback)
dropletSnapshot(id, name, callback)
dropletRestore(id, imageId, callback)
dropletRebuild(id, imageId, callback)
dropletRename(id, name, callback)
dropletBackupEnable(id, callback)
dropletBackupDisable(id, callback)
dropletDestroy(id, callback)
```

### Regions

```js
regionGetAll(callback)
```

### Images

```js
imageGetAll(callback)
imageGetGlobal(callback)
imageGetMine(callback)
imageGet(id, callback)
imageDestroy(id, callback)
imageTransfer(id, regionId, callback)
```

### SSH keys

```js
sshKeyGetAll(callback)
sshKeyGet(id, callback)
sshKeyAdd(name, pubKey, callback)
sshKeyEdit(id, pubKey, callback)
sshKeyDestroy(id, callback)
```

### Sizes

```js
sizeGetAll(callback)
```

### Domains

```js
domainGetAll(callback)
domainNew(name, ipAddress, callback)
domainGet(id, callback)
domainDestroy(id, callback)
domainRecordGetAll(id, callback)
domainRecordNew(id, recordType, data, name, priority, port, weight, callback)
domainRecordGet(domain_id, record_id, callback)
```

### Events
```js
eventGet(id, callback)
```
