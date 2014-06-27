var should = require('should');
var request = require('supertest');
var data = require('../data');
var util = require('util');
var async = require('async');
var config = require('../config');

describe('Api', function() {
    console.log('config.env: ' + config.env);
    var url;
    before(function(done) {
        url = 'http://localhost:' + config.listenPort();
        console.log('url: ' + url);
        data.destroyPerson({}, function(result) { done(); });
    });
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
                    res.body.should.be.an.instanceOf(Array).and.have.lengthOf(0);
                    done();
                });
            });
        });
        describe('With data', function() {
            before(function(done) {
                async.parallel([
                    function(callback) {
                        data.createPerson({name: 'Superman', superhuman: true}, function(result) { callback(); });
                    },
                    function(callback) {
                        data.createPerson({name: 'Batman', superhuman: false}, function(result) { callback(); });
                    }
                ], done);
            });
            it('should return people', function(done) {
                request(url).get('/api/people/')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function(err, res) {
                    if (err) {
                        throw err;
                    }
                    res.body.should.have.lengthOf(2);
                    res.body.should.containDeep([{
                        name: 'Superman',
                        superhuman: true}]);
                    res.body.should.containDeep([{
                        name: 'Batman',
                        superhuman: false}]);
                    res.body[0].should.have.property('id');
                    res.body[1].should.have.property('id');
                    done();
                });
            });
        });
    });
});
