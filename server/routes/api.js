var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
    res.set('Cache-Control', 'max-age=0, no-cache, no-store');
    res.set('Pragma', 'no-cache');
    next();
});

function setup(handlers) {
    router.get('/people', handlers.people.getPeople);
    router.post('/people', handlers.people.createPerson);
    router.get('/people/:id', handlers.people.getPerson);

    router.get('/alterego', handlers.alterego.getEgo);
}



module.exports = {
    setup: setup,
    router: router
};
