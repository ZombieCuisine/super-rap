var db = require('../data-core');
var schema = require('../schema');

exports.up = function(next){
    db.createTables(schema.tables, next);
};

exports.down = function(next){
    tableNames = []
    for(name in schema.tables){
        tableNames.push(name);
    }
    db.dropTables(tableNames, next);
};
