var default_set = require('./default.js');
var jwt = require("jsonwebtoken");
const isValid = exports.isValid = function(data) {
    if (data !== null && data !== undefined) {
        return true;
    } else {
        return false;
    }
}
const isEmptyString = exports.isEmptyString = function(data) {
    if (data === '') {
        return true;
    } else {
        return false;
    }
}

exports.jwtSign = function(data) {
    try {
        return jwt.sign(data, default_set.PRIVATE_KEY);
    } catch (err) {
        return err;
    }
}

exports.default_set = default_set;
    