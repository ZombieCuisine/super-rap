var should = require('should');
var request = require('supertest');
var util = require('./util');

describe('Api', function() {
    url = 'http://localhost:3000';
    describe('People', function() {
        describe('Without data', function() {
            it('should return an empty list', function(done) {
                request(url).get('/api/people/')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.equal([]);
                    done();
                });
            });
        });
        describe('With data', function() {
            before(function() {
                util.createPerson('Batman', true);
                util.createPerson('Robin', false);
            });
            it('should return people', function(done) {
                request(url).get('/api/people/')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.equal([{
                        name: 'Batman', id: 1},{
                        name: 'Robin', id: 2}]);
                    done();
                });
            });
        });
    });
});
