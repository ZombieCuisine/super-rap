var config = require('./config');
var massive = require('massive');

var _connect = function(callback){
    massive.connect(config.conString, function(e, db){
        if(e){ throw e; }
        callback(db);
    });
}
// Persons
exports.createPerson = function(person, callback){
    _connect(function(db){
        db.person.insert(person).execute(function(e, result){
            if(e){ throw e; }
            callback(result);
        })
    });
}
exports.updatePerson = function(update, query, callback){
    _connect(function(db){
        db.person.update(update, query).execute(function(e, result){
            if(e) { throw e; }
            callback(result);
        });
    });
}
exports.findPerson = function(query, callback){
    _connect(function(db){
        db.person.find(query).execute(function(e, result){
            if(e) { throw e; }
            callback(result);
        });
    });
}
exports.destroyPerson = function(query, callback){
    _connect(function(db){
        db.person.destroy(query).execute(function(e, result){
            if(e) { throw e; }
            callback(result);
        });
    });
}
