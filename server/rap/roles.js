data = require('../data');

function _serialize(json) {
    return JSON.stringify(json);
}

function _deserialize(jsonString) {
    return JSON.parse(jsonString);
}

function _keyFromStrings(strings) {
    strings.sort();
    return strings.join('-');
}

function createRolePermission(entityTypes, permissions) {
    return {
        assignedEntityTypes: entityTypes,
        grantedPermissions: permissions,
        key : _keyFromStrings(entityTypes),
    };
}

function addRolePermission(role, rolePermission) {
    if (rolePermission.key in role.permissions) {
        throw 'permission already exists for ' + rolePermission.key;
    }
    role.permissions.push(rolePermission);
}

function _deserializePermissions(permissions) {
    permissions = _deserialize(permissions);
    permissions.each(function(permission) {
        permission.key = _key_from_strings(permission.assignedEntityTypes);
    });
    return permissions;
}

function _serializePermissions(permissions) {
    console.log('serialize permissions: ' + util.inspect(permissions));
    minimalPermissions = [];
    permissions.each(function(permission) {
        minimalPermissions.push({
            assignedEntityTypes : permission.assignedEntityTypes,
            grantedPermissions : permission.grantedPermissions
        });
    });
    console.log('minimal permissions: ' + util.inspect(minimalPermissions));
    console.log('serialized: ' + _serialize(minimalPermissions));
    return _serialize(minimalPermissions);
}

function updateRole(role, callback) {
    console.log('here in update role!');
    rolePayload = {
        name: role.name,
        permissions : _serializePermissions(role.permissions),
    };
    data.updateRole(rolePayload, {id : role.id}, function(result) {
        callback();
    });
}

function createRole(name, callback) {
    data.createRole({ name: name, permissions: '[]'}, function(result) {
        role = result[0];
        if (role.permissions) {
            role.permissions = _deserializePermissions(role.permissions);
        }
        callback(role);
    });
}

function getRole(name, callback) {
    data.findRole({name: name}, function(result) {
        role = result[0];
        if (role.permissions) {
            role.permissions = _deserialize(role.permissions);
        }
        callback(role);
    });
};

function getRoles(callback) {
    data.findRole({}, function(result) {
        result.each(function(role) {
            role.permissions = _deserialize(role.permissions);
        });
        callback(result);
    });
}

function _loadEntityChain(entityType, entityId, callback) {
    var chain = [];
    if (entityType == 'person') {
        entity = data.findPerson({id : entityId}, function(result) {
            chain.push({id : entityId, type : 'person', entity : result[0]});
            data.findPersonTeam({person : entityId}, function(result) {
                var teamFinders = [];
                result.each(function(personTeam) {
                    teamFinders.push(function(done) {
                        _loadEntityChain('team', this.team, function(result) {
                            chain = chain.concat(result);
                            done();
                        });
                    }.bind(personTeam));
                });
                async.parallel(teamFinders, function(err) {
                    if (err) { throw err; }
                    callback(chain);
                });
            });
        });
    } else if (entityType == 'team') {
        entity = data.findTeam({id : entityId}, function(result) {
            chain.push({id : entityId, type : 'team', entity: result[0]});
            _loadEntityChain('company', result[0].company, function(result) {
                chain = chain.concat(result);
                callback(chain);
            });
        });
    } else if (entityType == 'company') {
        entity = data.findCompany({id : entityId}, function(result) {
            chain.push({id : entityId, type : 'company', entity: result[0]});
            chain.push({id : 0, type : 'system', entity: {id: 0}});
            callback(chain);
        });
    } else {
        throw 'entity type not supported: ' + entityType;
    }
}

function _serializeEntityChain(chain) {
    minimalChain = [];
    chain.each(function(link) {
        minimalChain.push({entityId: link.entityId, entityType: link.entityType});
    });
    return _serialize(minimalChain);
}

function createRoleAssignment(person, entityType, entityId, role, callback) {
    payload = {
        person : person.id,
        entityType : entityType,
        entityId : entityId,
        roleId : role.id
    };
    // entity chain
    _loadEntityChain(entityType, entityId, function(entityChain) {
        payload.entityChain = _serializeEntityChain(entityChain);
        data.createRoleAssignment(payload, callback);
    });
}

function getPersonRoleAssignments(person, callback) {
    data.findRoleAssignment({person: person.id}, function(result) {
        result.each(function(roleAssignment) {
            roleAssignment.entityChain = _deserialize(roleAssignment.entityChain);
        });
        callback(result);
    });
}

function speedTestGenerateData() {
    role = {
        name : 'the role',
        permissions : [{
            assignedEntityTypes: ['team'],
            grantedPermissions: ['createTeam'],
        },{
            assignedEntityTypes: ['person'],
            grantedPermissions: ['viewAlias'],
        }]
    };
    roleAssignments = [];
    companyId = 10;
    teamId = 100;
    roleAssignments.push({
        entityId : companyId, 
        entityType : 'company',
        entityChain : ['company-10'],
        role : role,
    });
    roleAssignments.push({
        entityId : teamId, 
        entityType : 'team',
        entityChain : ['company-10','team-100'],
        role : role,
    });
    for (var i = 1000; i < 13000; i++) {
        ra = {
            entityId : i,
            entityType : 'person',
            entityChain : ['company-10','person-' + 1,'team-100'],
        };
        roleAssignments.push(ra);
    }
    return roleAssignments;
}

function speedTestSubset(refSet, testSet) {
    testSet.each(function(val) {
        if (!(val in refSet)) {
            return false;
        }
    });
    return true;
}

function speedTestGetMaskedPermissions(role, assignedEntityTypes) {
    var mergedPermissions = {};
    role.permissions.each(function(permission) {
        grantedPermissions = permission.grantedPermissions;
        ifAssignedEntityTypes = permission.assignedEntityTypes;
        if (speedTestSubset(ifAssignedEntityTypes, assignedEntityTypes)) {
            grantedPermissions.each(function(grantedPermission) {
                mergedPermissions[grantedPermission] = true;
            });
        }
    });
    return mergedPermissions;
}

function speedTestGetPermissions(roleAssignments) {
    permissions = {};
    assignedEntityTypes = [];
    roleAssignments.each(function(roleAssignment) {
        assignedEntityTypes.push(roleAssignment.entityType);
    });
    roleAssignments.each(function(roleAssignment) {
        if ('role' in roleAssignment) {
            maskedPermissions = speedTestGetMaskedPermissions(roleAssignment.role, assignedEntityTypes);
            for (var maskedPermission in maskedPermissions) {
                permissions[maskedPermission] = true;
            }
        }
    });
    return permissions;
}

function speedTestIsAllowed(permission, roleAssignment, roleAssignmentsByEntity) {
    var roleAssignments = [];
    roleAssignment.entityChain.each(function(entityLink) {
        //console.log(util.inspect(entityLink));
        var key = [entityLink.entityType, entityLink.entityId].join('-');
        //console.log(key);
        if (entityLink in roleAssignmentsByEntity) {
            roleAssignments = roleAssignments.concat(roleAssignmentsByEntity[entityLink]);
        }
    });
    //console.log(util.inspect(roleAssignments));
    permissions = speedTestGetPermissions(roleAssignments);
    return permission in permissions;
}

function speedTest(roleAssignments) {
    //console.log(util.inspect(roleAssignments));
    var result = {};
    roleAssignmentsByEntity = {};
    roleAssignments.each(function(roleAssignment) {
        var key = [roleAssignment.entityType, roleAssignment.entityId].join('-');
        if (roleAssignmentsByEntity.hasOwnProperty(key)) {
            roleAssignmentsByEntity[key].push(roleAssignment);
        } else {
            roleAssignmentsByEntity[key] = [roleAssignment];
        }
    });
    //console.log(roleAssignmentsByEntity);
    roleAssignments.each(function(roleAssignment) {
        if (speedTestIsAllowed('viewAlias', roleAssignment, roleAssignmentsByEntity)) {
            if (roleAssignment.entityType in result) {
                result[roleAssignment.entityType].push(roleAssignment.entityId);
            } else {
                result[roleAssignment.entityType] = [roleAssignment.entityId];
            }
        }
    });
    //console.log('RESULT: ' + util.inspect(result));
    return result;
}


module.exports = {
    _serialize : _serialize,
    _deserialize : _deserialize,
    _loadEntityChain : _loadEntityChain,
    createRole : createRole,
    updateRole : updateRole,
    getRole : getRole,
    getRoles : getRoles,
    createRolePermission : createRolePermission,
    addRolePermission : addRolePermission,
    createRoleAssignment : createRoleAssignment,


    speedTestGenerateData : speedTestGenerateData,
    speedTest : speedTest,
};
