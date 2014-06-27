exports.env = 'dev';

exports.conString = function() {
    return exports.config[exports.env].conString;
}
exports.listenPort= function() {
    return exports.config[exports.env].listenPort;
}

exports.config = {
    test : {
        conString : 'postgres://super_rap:super_rap@127.0.0.1/test_super_rap',
        listenPort : 3001
    },
    dev : {
        conString : 'postgres://super_rap:super_rap@127.0.0.1/super_rap',
        listenPort : 3000
    }
}
