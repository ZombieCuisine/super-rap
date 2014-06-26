function getPeople(req, res, next) {
    console.log(req.cookies.get('ego_id'));
    res.send(200, [{id: 1, name: 'Batman'}, {id: 2, name: 'Wonder Woman'}]);
}

function createPerson(req, res, next) {
    res.cookies.set('ego_id', req.body.name);
    console.log('post to people');
    console.log(req.body);
    res.send(204);
}

function getPerson(req, res, next) {
    console.log(req.cookies.get('ego_id'));
    console.log(req.params.id);
    res.send(200, {id: 1, name: 'Batman', skills: ['rich', 'dark'], friends: ['his butler', 'that one girl']});
}

module.exports = {
    getPerson: getPerson,
    getPeople: getPeople,
    createPerson: createPerson
}
