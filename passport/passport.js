
const BearerStrategy = require('passport-http-bearer').Strategy,
    jwt = require('jsonwebtoken');
const common = require("../config/common.js");
const db = require("../db.js");
const UserModel = db.UserModel();

module.exports = function(passport) {
    // Bearer token based authentication
    passport.use('authentication', new BearerStrategy(function(token, done) {
        jwt.verify(token, common.default_set.PRIVATE_KEY, function(err, user) {
            if (err) {
                console.log('passport jwt err', err);
                return done({
                    status: 401,
                    message: 'You are not authenticated'
                });
            } else {
                if (user) {
                    UserModel.findById(user.id)
                    .select({ "role": 1, "firstName": 1, "lastName": 1, "status": 1, "isDeleted" : 1, "phoneNumber": 1})
                    .exec(function(err, userData) {
                        if (err) {
                            console.log("dberror passport authentication", err);
                            return done({
                                status: 401,
                                message: 'Internal server error, unable to authenticate'
                            })
                        } else {
                            if (!common.isValid(userData)) {
                                return done({
                                    status: 401,
                                    message: 'Unable to authenticate'
                                })
                            } else if (userData.isDeleted == true) {
                                return done({
                                    status: 401,
                                    message: 'You are not authenticated'
                                })
                            } else if (userData.status != 'active') {
                                return done({
                                    status: 401,
                                    message: 'Your account is inactive'
                                })
                            } else {
                                //reset details from db
                                user['roleId'] = userData.role;
                                user['firstName'] = userData.firstName;
                                user['lastName'] = userData.lastName;
                                user['fullName'] = (userData.firstName) + ' ' + (userData.lastName ? userData.lastName : '');
                                user['phoneNumber'] = userData.phoneNumber;
                                return done(null, user);
                            }
                        }
                    })
                } else {
                    return done({
                        status: 401,
                        message: 'You are not authenticated'
                    });
                }
            }
        });
    }));
}