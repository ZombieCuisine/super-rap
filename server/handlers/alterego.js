var data = require('../data');

function getEgo(req, res, next) {
    console.log(req.query.id);
    if (req.query.id) {
        data.findPerson({id: req.query.id}, function(person) {
            if (!person || person.length == 0) {
                res.send(400, 'ego not found');
            } else {
                console.log(person);
                person = person[0];
                console.log('ego: ' + person.id + ', ' + person.name);
                res.cookies.set('ego_id', person.id, {httpOnly: false});
                res.cookies.set('ego_name', person.name, {httpOnly: false});
                res.send(200, person)
            }
        });
    } else {
        // logout
        console.log('logging out');
        res.cookies.set('ego_id').set('ego_name');
        res.send(200, {})
    }
}

module.exports = {
    getEgo: getEgo
}
