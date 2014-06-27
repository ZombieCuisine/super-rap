var data = require('./data-core');
var using = data.using;
// Persons
exports.createPerson = function(person, callback){
    using.db(function(db, run){
        var q = db.person.insert(person);
        run(null, q);
    }, callback);
}
exports.updatePerson = function(update, query, callback){
    using.db(function(db, run){
        var q = db.person.update(update, query);
        run(null, q);
    }, callback);
}
exports.findPerson = function(query, callback){
    using.db(function(db, run){
        var q = db.person.find(query);
        run(null, q);
    }, callback);
}
exports.destroyPerson = function(query, callback){
    using.db(function(db, run){
        var q = db.person.destroy(query);
        run(null, q);
    }, callback);
}
