var config = require('../config');
var massive = require('massive');
var async = require('async');
exports.up = function(next){
    massive.connect(config.conString, function(err, db){
        async.parallel([
            function(callback){
                db.dropTable('hero').execute(function(e, r) { callback(); });
            },
            function(callback){
                db.createTable('person', {
                    name            : 'string not null',
                    superhuman      : 'bool',
                }).execute(function(e, r){ callback(null, 'person'); });
            },
            function(callback){
                db.createTable('skill', {
                    name            : 'string not null',
                    acquiredVia     : 'string not null',
                }).execute(function(e, r){ callback(null, 'skill'); });
            },
            function(callback){
                db.createTable('friend', {
                    name            : 'string not null',
                    relation        : 'string not null',
                    sidekick        : 'bool',
                }).execute(function(e, r){ callback(null, 'friend'); });
                
            },
        ], function(err, result){
            console.log(err || result);
            next();
        });
    });
};

exports.down = function(next){
    massive.connect(config.conString, function(err, db){
        async.parallel([
            function(callback){
                db.dropTable('person').execute(function(err, result) { callback(); });
            },
            function(callback){
                db.dropTable('skill').execute(function(err, result) { callback(); });
            },
            function(callback){
                db.dropTable('friend').execute(function(err, result) { callback(); });
            },
        ], function(err, result){
            console.log(err || result);
            next();
        });
    });
};
