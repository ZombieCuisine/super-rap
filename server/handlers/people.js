data = require('../data');
util = require('util');

function getPeople(req, res, next) {
    data.findPerson({}, function(people) {
        console.log('getPeople: ' + util.inspect(people));
        if (people.length == 0) {
            res.json(200, []);
        } else {
            res.json(200, people);
        }
    });
}

function createPerson(req, res, next) {
    console.log('post to people');
    console.log(req.body);
    data.createPerson(req.body, function(person) {
        res.send(204);
    });
}

function getPerson(req, res, next) {
    console.log(req.params.id);
    data.findPerson({id: req.params.id}, function(person) {
        console.log('getPerson: ' + person);
        res.send(200, person);
    });
}

module.exports = {
    getPerson: getPerson,
    getPeople: getPeople,
    createPerson: createPerson
}
