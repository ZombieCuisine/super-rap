var pg = require('pg.js');

var conString = 'postgres://super_rap:super_rap@127.0.0.1/super_rap';

exports.up = function(next){
    console.log('up');
    pg.connect(conString, function(err, client, done) {
        console.log('connected');
        client.query('create table hero(name varchar(100) not null, born timestamp with time zone not null default now())', function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
            next();
        });
    });
};

exports.down = function(next){
    console.log('down');
    pg.connect(conString, function(err, client, done) {
        console.log('connected');
        client.query('drop table hero', function(err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
            }
            next();
        });
    });
};
