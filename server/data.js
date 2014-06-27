var data = require('./data-core');
// Persons
exports.createPerson = function(person, callback){
    data.insert('person', person, callback)
}
exports.updatePerson = function(update, query, callback){
    data.update('person', update, query, callback);
}
exports.findPerson = function(query, callback){
    data.query('person', query, callback);
}
exports.destroyPerson = function(query, callback){
    data.destroy('person', query, callback);
}
