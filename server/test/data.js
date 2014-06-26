var should = require('should');
var data = require('../data');

describe('Person Tests', function(){
    it('should create, get, update and destroy a person', function(done){
        data.createPerson({
            name : 'Superman',
            superhuman : true,
        }, function(results){
            results.should.have.length(1);
            var person = results[0];
            person.should.have.property('name', 'Superman');
            person.should.have.property('superhuman', true);
            person.should.have.property('id');

            data.updatePerson({ superhuman : false }, { id: person.id}, function(updated){
                updated.should.have.property('rowCount', 1);

                data.findPerson({id : person.id}, function(found){
                    found.should.have.length(1);
                    person = found[0];
                    person.should.have.property('name', 'Superman');
                    person.should.have.property('superhuman', false);
                    person.should.have.property('id');

                    data.destroyPerson({id : person.id}, function(deleted){
                        deleted.should.have.property('rowCount', 1);
                        done();
                    });
                });
            });
        });
    })
})
