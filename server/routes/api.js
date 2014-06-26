var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
    res.set('Cache-Control', 'max-age=0, no-cache, no-store');
    res.set('Pragma', 'no-cache');
    next();
});

router.get('/people', function(req, res, next) {
    console.log(req.cookies.get('ego_id'));
    res.send(200, [{id: 1, name: 'Batman'}, {id: 2, name: 'Wonder Woman'}]);
});

router.post('/people', function(req, res, next) {
    res.cookies.set('ego_id', req.body.name);
    console.log('post to people');
    console.log(req.body);
    res.send(204);
});

router.get('/people/:id', function(req, res, next) {
    console.log(req.cookies.get('ego_id'));
    console.log(req.params.id);
    res.send(200, {id: 1, name: 'Batman', skills: ['rich', 'dark'], friends: ['his butler', 'that one girl']});
});

router.get('/alterego', function(req, res, next) {
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
});


module.exports = router;
