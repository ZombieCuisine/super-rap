var express = require('express');

var router = express.Router();


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
    res.send(200, {id: 1, name: 'Batman', skills: ['rich', 'dark']});
});

router.get('/alterego', function(req, res, next) {
    console.log(req.query.id);
    var ego = {id: 1, name: 'Invisible Man'}; // lookup person
    if (!ego) {
        res.send(400, 'ego not found');
    } else {
        res.cookies.set('ego_id', ego.id);
        res.send(200, ego)
    }
});


module.exports = router;
