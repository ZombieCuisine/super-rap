#!/usr/bin/env node

var express = require('express');
var app = express();
var entities = require('../platform/entities.js');

// setup the client web server
var client_dir = '../client';
console.log(client_dir)
app.use(express.static(client_dir));

entities.init();

app.listen(3000);
console.log('listening on port 3000');
