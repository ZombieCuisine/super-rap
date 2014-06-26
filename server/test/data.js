var async = require('async');
var should = require('should');
var data = require('../data');

describe('Person Tests', function(){
    it('should allow CRUD on a person', function(done){
        var create = function(callback){
            data.createPerson({ name : 'Superman', superhuman : true }, function(results){
                results.should.have.length(1);
                var person = results[0];
                person.should.have.property('name', 'Superman');
                person.should.have.property('superhuman', true);
                person.should.have.property('id');
                personId = person.id;
                callback(null, person.id, person.superhuman);
            })
        }
        var find = function(personId, superhuman, callback){
            data.findPerson({id : personId}, function(found){
                found.should.have.length(1);
                person = found[0];
                person.should.have.property('name', 'Superman');
                person.should.have.property('superhuman', superhuman);
                person.should.have.property('id');
                callback(null, person.id);
            });
        }
        var update = function(personId, callback){
            data.updatePerson({ superhuman : false }, { id: person.id }, function(updated){
                updated.should.have.property('rowCount', 1);
                callback(null, personId, false);
            });
        }
        var destroy = function(personId, callback){
            data.destroyPerson({ id : personId }, function(deleted){
                deleted.should.have.property('rowCount', 1);
                callback();
            });
        }
        async.waterfall([create, find, update, find, destroy], function(){ done(); });
    });
})
