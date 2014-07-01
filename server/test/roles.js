roles = require('../rap/roles');
async = require('async');
data = require('../data');
util = require('util');

describe('roles stringify', function() {
    it('should return valid json string', function() {
        results = roles._serialize({ bunch: { of: { valid: 'json' }}});
        results.should.equal('{"bunch":{"of":{"valid":"json"}}}');
    });
});

describe('roles parse', function() {
    it('should return valid json', function() {
        results = roles._deserialize('{"bunch":{"of":{"valid":"json"}}}');
        results.should.eql({ bunch: { of: { valid: 'json' }}});
    });
});

function _createPerson(callback) {
    async.waterfall([
        function(done) { 
            data.createCompany({
                name: 'DC', 
                headquarters: 'Metropolis',
                established: new Date('2000-01-01T00:00:00')
            }, function(result) { done(null, result[0]); });
        },
        function(company, done) { 
            console.log('create team for company: ' + util.inspect(company));
            data.createTeam({
                name: 'Super Team', 
                company : company.id,
            }, function(result) { done(null, result[0], company); });
        },
        function(team, company, done) {
            console.log('create person for team: ' + util.inspect(team));
            data.createPerson({
                name: 'Superman',
                company: company.id,
                alias: 'Clark Kent',
                superhuman: true
            }, function(result) { testPerson = result[0]; done(null, result[0], team); });
        },
        function(person, team, done) {
            console.log('add person ' + util.inspect(person) + ' for team: ' + util.inspect(team));
            data.createPersonTeam({
                person: person.id,
                team: team.id
            }, function(result) { done(null, person); });
        },
        ], function(err, result) {
            console.log('result is: ' + util.inspect(result));
            this.person = result;
            callback(null, result);
        });
}

describe('load entity chain', function() {
    describe('with one team', function() {
        var testPerson;
        before(function(callback) {
            _createPerson(function(err, person) {
                console.log('setup callback called with: ' + util.inspect(person));
                testPerson = person;
                callback();
            });
        });
        it('should load the chain', function(callback) {
            roles._loadEntityChain('person', testPerson.id, function(chain) {
                console.log(util.inspect(chain));
                chain.should.containDeep([{type: 'person', entity: {name: 'Superman'}}]);
                chain.should.containDeep([{type: 'team', entity: {name: 'Super Team'}}]);
                chain.should.containDeep([{type: 'company', entity: {name: 'DC'}}]);
                chain.should.containDeep([{type: 'system', entity: {id: 0}}]);
                callback();
            });
        });
    });
});

describe('roles kitchen sink', function() {
    before(function(callback) {
        _createPerson(callback);
    });
    it('should exceed my wildest dreams', function(callback) {
        roles.createRole('test', function(role) {
            role.should.have.keys(['id', 'name', 'permissions']);
            roles.getRole('test', function(loadedRole) {
                role.should.eql(loadedRole);
                roles.getRoles(function(loadedRoles) {
                    loadedRoles.should.have.lengthOf(1);
                    loadedRoles.should.containEql(role);
                    callback();
                });
            });
        });
    });
});


describe('role assignments kitchen sink', function() {
    var setupData = {};
    before(function(callback) {
        function createRole(done) {
            roles.createRole('test', function(role) {
                this.role = role;
                roles.addRolePermission(role, roles.createRolePermission(['team'], ['abandonTeam', 'saveTeam']));
                roles.addRolePermission(role, roles.createRolePermission(['person', 'team'], ['viewAlias']));
                console.log('updating role: ' + util.inspect(role, { depth: null }));
                roles.updateRole(role, function() {
                    done();
                });
            });
        }
        async.parallel([
            _createPerson.bind(setupData),
            createRole.bind(setupData),
            ], function(done) {
                callback();
            });
    });
    it('should exceed my wildest dreams', function(callback) {
        console.log('setup data: ' + util.inspect(setupData));
        callback();
    });
});

describe('speed test', function() {
    it('should run really fast', function() {
        console.log('generate data');
        roleAssignments = roles.speedTestGenerateData();
        console.log('run test');
        var start = Date.now();
        roles.speedTest(roleAssignments);
        var end = Date.now()
        console.log('done in ' + (end-start) + 'ms');
    });
});

