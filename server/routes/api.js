var express = require('express');

var router = express.Router();


router.get('/heroes', function(req, res, next) {
    res.json([{id: 1, name: 'Batman'}, {id: 2, name: 'Wonder Woman'}]);
});

router.post('/heroes', function(req, res, next) {
    console.log('post to heroes');
    console.log(req.body);
    res.writeHead(204);
    res.end();
});

router.get('/login', function(req, res, next) {
    res.cookies.set('user_id', 'blah');
});


module.exports = router;
