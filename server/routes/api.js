var express = require('express');

var router = express.Router();


router.get('/heroes', function(req, res, next) {
    res.json([{id: 1, name: 'Batman'}, {id: 2, name: 'Wonder Woman'}]);
    next();
});


module.exports = router;
