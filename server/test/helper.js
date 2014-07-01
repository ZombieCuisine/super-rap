config = require('../config');
data = require('../data');
schema = require('../schema');

before(function(done) {
    config.env = 'test';
    tableNames = [];
    for(name in schema.tables){
        tableNames.push(name);
    }
    data.dropTables(tableNames, function() {
        data.createTables(schema.tables, function() { 
            done(); 
        });
    });
});
