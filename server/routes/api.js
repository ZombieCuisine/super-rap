var express = require('express');

var router = express.Router();

router.use(function(req, res, next) {
    res.set('Cache-Control', 'max-age=0, no-cache, no-store');
    res.set('Pragma', 'no-cache');
    next();
});

function setup(handlers) {
    router.route('/people')
        .get(handlers.people.getPeople)
        .post(handlers.people.createPerson);

    router.route('/people/:id')
        .get(handlers.people.getPerson);

    router.route('/alterego')
        .get(handlers.alterego.getEgo);
}



module.exports = {
    setup: setup,
    router: router
};
