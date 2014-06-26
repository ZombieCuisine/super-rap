var should = require('should');
var request = require('supertest');

describe('Api', function() {
    url = 'http://localhost:3000';
    describe('People', function() {
        it('should return empty list when there are no people', function(done) {
            request(url).get('/api/people/')
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                if (err) {
                    throw err;
                }
                res.body.should.equal([]);
            });
        });
    });
});
