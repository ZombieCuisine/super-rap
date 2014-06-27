require('sugar');
var config = require('./config');
var format = require('util').format;
var async = require('async');
var massive = require('massive');
var schema = require('./schema');

var _createTable = function(callback){
    this.db.createTable(this.name, this.columns).execute(function(e, r){
        if(e){ throw e; }
        callback(null, r);
    });
}
var _dropTable = function(callback){
    this.db.run('drop table ' + this.table, function(e, r){
        if(e){ throw e; }
        callback(null, r)
    });
}
var _insert = function(callback){
    this.db[this.table].insert(this.data).execute(function(e, r){
        if(e){ throw e; }
        callback(r);
    });
};
var _update = function(callback){
    this.db[this.table].update(this.data, this.query).execute(function(e, r){
        if(e){ throw e; }
        callback(r);
    });
};
var _destroy = function(callback){
    this.db[this.table].destroy(this.query).execute(function(e, r){
        if(e){ throw e; }
        callback(r);
    });
}
var _find = function(callback){
    this.db[this.table].find(this.query).execute(function(e, r){
        if(e){ throw e; }
        if (r.hasOwnProperty('oid')) {
            callback([]);
        } else {
            callback(r);
        }
    });
}
var _connect = function(callback){
    massive.connect(config.conString, function(e, db){
        if(e) { throw e; }
        callback(db);
    });
}

exports.createTables = function(tables, callback){
    _connect(function(db){
        var jobs = []
        for(name in tables){
            var context = {
                db      : db,
                name    : name,
                columns : tables[name],
            }
            jobs.push(_createTable.bind(context));
        }
        async.parallel(jobs, callback); 
    });
}
exports.dropTables = function(tables, callback){
    _connect(function(db){
        var jobs = []
        tables.each(function(table){
            var context = {
                db      : db,
                table    : table,
            }
            jobs.push(_dropTable.bind(context));
        });
        async.parallel(jobs, callback);
    });
}
exports.insert = function(table, data, callback){
    _connect(function(db){
        var context = { db : db, table : table, data : data }
        _insert.bind(context)(callback);
    });
}
exports.update = function(table, data, query, callback){
    _connect(function(db){
        var context = { db : db, table : table, data : data, query : query }
        _update.bind(context)(callback);
    });
}
exports.destroy = function(table, query, callback){
    _connect(function(db){
        var context = { db : db, table : table, query : query }
        _destroy.bind(context)(callback);
    });
}
exports.find = function(table, query, callback){
    _connect(function(db){
        context = { db : db, table : table, query : query };
        _find.bind(context)(callback);
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////
// data access method generation
////////////////////////////////////////////////////////////////////////////////////////////////////
for(name in schema.tables){
    var title = name.camelize(true);
    console.log('Generating data access methods for ' + name);
    var context = { tableName : name };
    // create
    var methodName = format('create%s', title);
    console.log('\t adding method %s', methodName);
    exports[methodName] = function(data, callback){
        exports.insert(this.tableName, data, callback);
    }.bind(context);
    // update
    methodName = format('update%s', title);
    console.log('\t adding method %s', methodName);
    exports[methodName] = function(data, query, callback){
        exports.update(this.tableName, data, query, callback);
    }.bind(context);
    // find
    methodName = format('find%s', title);
    console.log('\t adding method %s', methodName);
    exports[methodName] = function(query, callback){
        exports.find(this.tableName, query, callback);
    }.bind(context);
    // destroy
    methodName = format('destroy%s', title);
    console.log('\t adding method %s', methodName);
    exports[methodName] = function(query, callback){
        exports.destroy(this.tableName, query, callback);
    }.bind(context);
}
