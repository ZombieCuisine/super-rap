var express = require('express');

var router = express.Router();


router.get('/heroes', function(req, res, next) {
    console.log(req.cookies.get('user_id'));
    res.send(200, [{id: 1, name: 'Batman'}, {id: 2, name: 'Wonder Woman'}]);
});

router.post('/heroes', function(req, res, next) {
    res.cookies.set('user_id', req.body.name);
    console.log('post to heroes');
    console.log(req.body);
    res.send(204);
});

router.get('/login', function(req, res, next) {
    var user = {id: 1}; // lookup user
    if (!user) {
        res.send(400, 'user not found');
    } else {
        res.cookies.set('user_id', user.id);
        res.send(200, user)
    }
});


module.exports = router;
