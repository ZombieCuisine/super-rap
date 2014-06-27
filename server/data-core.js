var config = require('./config');
var async = require('async');
var massive = require('massive');

exports.createSchema = function(schema, callback){
    var _createTable = function(callback){
        this.db.createTable(this.name, this.columns).execute(function(e, r){
            if(e){ throw e; }
            callback(null, r);
        });
    }
    massive.connect(config.conString, function(e, db){
        var jobs = []
        for(name in schema){
            var context = {
                db      : db,
                name    : name,
                columns : schema[name],
            }
            jobs.push(_createTable.bind(context));
        }
        async.parallel(jobs, callback); 
    });
}
exports.insert = function(table, data, callback){
    var _insert = function(callback){
        this.db[this.table].insert(this.data).execute(function(e, r){
            if(e){ throw e; }
            callback(r);
        });
    };
    massive.connect(config.conString, function(e, db){
        if(e){ throw e; }
        var context = { db : db, table : table, data : data }
        _insert.bind(context)(callback);
    });
}
exports.update = function(table, data, query, callback){
    var _update = function(callback){
        this.db[this.table].update(this.data, this.query).execute(function(e, r){
            if(e){ throw e; }
            callback(r);
        });
    };
    massive.connect(config.conString, function(e, db){
        if(e){ throw e; }
        var context = { db : db, table : table, data : data, query : query }
        _update.bind(context)(callback);
    });
}
exports.destroy = function(table, query, callback){
    var _destroy = function(callback){
        this.db[this.table].destroy(query).execute(function(e, r){
            if(e){ throw e; }
            callback(r);
        });
    }
    massive.connect(config.conString, function(e, db){
        if(e){ throw e; }
        var context = { db : db, table : table, query : query }
        _destroy.bind(context)(callback);
    });
}
exports.query = function(table, query, callback){
    var _query = function(callback){
        this.db[this.table].find(query).execute(function(e, r){
            if(e){ throw e; }
            callback(r);
        });
    }
    massive.connect(config.conString, function(e, db){
        context = { db : db, table : table, query : query };
        _query.bind(context)(callback);
    })
}
