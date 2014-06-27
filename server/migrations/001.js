var data = require('../data');
var schema = require('../schema');

exports.up = function(next){
    data.createTables(schema.tables, next);
};

exports.down = function(next){
    tableNames = []
    for(name in schema.tables){
        tableNames.push(name);
    }
    data.dropTables(tableNames, next);
};
