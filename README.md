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
// Import module
var DigitalOceanAPI = require('digitalocean-api');
// Create instance with your credentials
var api = new DigitalOceanAPI('client_id', 'api_key');

// Get things done
api.dropletGetAll(function(error, droplets){
	console.log(droplets);
});

```