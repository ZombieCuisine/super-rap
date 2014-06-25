var config = require('../config');
var pg = require('pg.js');

exports.up = function(next){
    console.log('up');
    pg.connect(config.conString, function(err, client, done) {
        console.log('connected');
        client.query('create table hero(name varchar(100) not null, born timestamp with time zone not null default now())', function(err, result) {
            console.log(err || result);
            next();
        });
    });
};

exports.down = function(next){
    console.log('down');
    pg.connect(config.conString, function(err, client, done) {
        console.log('connected');
        client.query('drop table hero', function(err, result) {
            console.log(err || result);
            next();
        });
    });
};
