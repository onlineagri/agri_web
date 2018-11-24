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

exports.slugify = function(name){
    return slug(name); 
}

exports.isValidImageType = function(type){
    var found = lodash.indexOf(validImageTypes, type);
    if (found === -1) {
        return false;
    } else {
        return true;
    }
}

exports.decodeBase64Image = function(dataString, res) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    //console.log("dataString", dataString)
    var response = {};
    if (matches) {
        if (matches.length !== 3) {
            res.json({
                "code": 401,
                "message": "Invalid input string"
            });
            //return new Error('Invalid input string');
        }
        response.type = matches[1];
        response.data = new Buffer(matches[2], 'base64');
        return response;
    } else {
        return "err";
        //return new Error('Invalid base64 input string');
    }

}

exports.default_set = default_set;
    