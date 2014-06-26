function getEgo(req, res, next) {
    console.log(req.query.id);
    if (req.query.id) {
        var ego = {id: 1, name: 'Invisible Man'}; // lookup person
        if (!ego) {
            res.send(400, 'ego not found');
        } else {
            console.log('ego: ' + ego.id + ', ' + ego.name);
            res.cookies.set('ego_id', ego.id, {httpOnly: false});
            res.cookies.set('ego_name', ego.name, {httpOnly: false});
            res.send(200, ego)
        }
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
