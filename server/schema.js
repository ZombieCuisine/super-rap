exports.tables =  {
    company : {
        name            : 'string not null',
        headquarters    : 'string',
        established     : 'date',
    },
    team : {
        name            : 'string not null',
        company         : 'int',
    },
    person : {
        name            : 'string not null',
        company         : 'int',
        alias           : 'string',
        superhuman      : 'bool',
    },
    person_team : {
        person  : 'int not null',
        team    : 'int not null',
    },
    role        : {
        name            : 'string not null',
        permissions     : 'text not null',
    },
    role_assignment : {
        name            : 'string not null',
        person          : 'int not null',
        entityType      : 'string not null',
        entityId        : 'string not null',
        entityChain     : 'text not null',
        roleId          : 'int',
    },
}

