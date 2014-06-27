var config = require('./config');
var async = require('async');
var massive = require('massive');

exports.using = function(){
    var _exec = function(query, callback){
        query.execute(function(e, result){
            if(e){ throw e; }
            callback(null, result)
        });
    }
    var _connect = function(callback){
        massive.connect(config.conString, function(e, db){
            if(e){ throw e; }
            callback(null, db);
        });
    }
    var _db = function(query, callback){
        chain = [_connect, query, _exec]
        async.waterfall(chain, function(e, r){
            if(e){ throw e; }
            callback(r);
        });
    }
    return { db : _db };
}();

