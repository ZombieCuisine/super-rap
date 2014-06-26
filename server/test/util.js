var config = require('../config');
var massive = require('massive');

function createPerson(name, is_superhuman) {
    massive.connect(config.conString, function(err, db) {
        db.person.insert({name: name, superhuman: is_superhuman}).execute(function(err, result){
            if (err) {
                throw err;
            }
        });
    });
}

module.exports = {
    createPerson : createPerson
};
