var config = require('./config');
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
        callback(r);
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
        for(var i = 0; i < tables.length; i++){
            var context = {
                db      : db,
                table    : tables[i],
            }
            jobs.push(_dropTable.bind(context));
        }
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
function titleCase(name){
    var segments = name.split('_');
    var clean = []
    for(var i = 0; i < segments.length; i++){
        var x = segments[i];
        clean.push(x.substring(0, 1).toUpperCase() + x.substring(1, x.length));
    }
    return clean.join('');
}
for(name in schema.tables){
    var title = titleCase(name);
    console.log(title);
    var context = { tableName : name };
    // create
    exports['create' + title] = function(data, callback){
        exports.insert(this.tableName, data, callback);
    }.bind(context);
    // update
    exports['update' + title] = function(data, query, callback){
        exports.update(this.tableName, data, query, callback);
    }.bind(context);
    // find
    exports['find' + title] = function(query, callback){
        exports.find(this.tableName, query, callback);
    }.bind(context);
    // destroy
    exports['destroy' + title] = function(query, callback){
        exports.destroy(this.tableName, query, callback);
    }.bind(context);

}

