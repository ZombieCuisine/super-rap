#!/usr/bin/env node

var config = require('./config');
console.log(process.argv);
args = process.argv.slice(2);
if (args.length == 1) {
    console.log('running for env: ' + args[0]);
    config.env = args[0];
}
console.log('connect to database ' + config.conString());

var express = require('express');
var app = express();
var cookies = require('cookies');
var bodyParser = require('body-parser');
var entities = require('../platform/entities.js');

// setup the client web server
var client_dir = '../client';
console.log(client_dir)
app.use(express.static(client_dir));
app.use(cookies.express());
app.use(bodyParser.json());

entities.init();

// setup the api route
var api = require('./routes/api');

var peopleHandler = require('./handlers/people');
var alterEgoHandler = require('./handlers/alterego');

handlers = {
    people : peopleHandler,
    alterego : alterEgoHandler
}

api.setup(handlers);
app.use('/api', api.router);

app.listen(config.listenPort());
console.log('listening on port ' + config.listenPort());

module.exports = app;
