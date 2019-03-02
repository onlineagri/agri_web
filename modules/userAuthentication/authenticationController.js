const mongoose = require('mongoose');
var db = require("../../db.js");
var UserModel = db.UserModel();
var common = require("../../config/common.js");
var textLocal = require("../../config/textLocal.js");
var async = require("async");
const nodemailer = require('nodemailer');
const eventEmmiters = require('../../config/eventEmmiters.js');

let transporter = nodemailer.createTransport({
    service:'gmail', // true for 465, false for other ports
    auth: {
        user: common.default_set.EMAIL_FROM, // generated ethereal user
        pass: common.default_set.EMAIL_FROM_PASS // generated ethereal password
    }
});

exports.login = function(req, res){
	let queryData = req.body;
	if(!common.isValid(queryData.phoneNumber) || !common.isValid(queryData.password) || !common.isValid(queryData.role)){
		res.json({code: 400, message: "Please enter all the fields"});
		return;
	}

	UserModel.findOne({phoneNumber : queryData.phoneNumber, isDeleted : false, role: queryData.role})
			.select({'_id': 1, 'phoneNumber': 1, 'password':1, 'firstName': 1, 'status': 1, 'role': 1, 'verified' : 1})
			.exec(function(err, data){
				if(err){
					console.log("dberror login", err);
					res.json({code:400, message: 'Internal server error'});
				} else {
					let userData = data;
					if(common.isValid(userData)){
                        console.log(userData,"userData");
						if(db.validPassword(queryData.password, userData.password)){
                            console.log(userData.status , userData.verified);
							if(userData.status == 'active'){
								let params = {
					                id: userData._id,
					                role: userData.role
					            };
					            params['firstName'] = userData.firstName || "";
					           	params['phoneNumber'] = userData.phoneNumber;

					            let token = common.jwtSign(params);
					            
								res.json({code:200, message: "Login Success", token: token, data: {"firstName": userData.firstName, phoneNumber: userData.phoneNumber}});
							} else {
								res.json({code:400, message: "You are not active user, please verify your phone number using OTP sent at your phone number"});
							}
						} else {
							res.json({code: 400, message: "Phone number or password is incorrect"});
						}

					} else {
						res.json({code:400, message: "User not exists, please create new account"});
					}
				}
			})


}

exports.userRegister = function(req, res){
	let userData = req.body;
    let userId;
	if(!common.isValid(userData.firstName) || !common.isValid(userData.email) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber) || !common.isValid(userData.password) || !common.isValid(userData.role)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }

    let verificationCode = Math.floor((Math.random() * 1000000) + 1);
    async.series([
        function(callback){
            UserModel.findOne({phoneNumber: userData.phoneNumber, isDeleted : false, role: 'admin'}, function(err, data){
                if (err) {
                    console.log('dberror userRegister', err);
                    callback('Internal server error');
                } else{
                    if (common.isValid(data)) {
                        callback('User already exists with this Phone Number');
                    } else{
                        callback();
                    }
                }
            });
        },
        function(callback){
            UserModel.findOne({email: userData.email, isDeleted : false, role: userData.role}, function(err, data){
                if(err){
                    console.log("dberror userRegister", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        callback("User already exists with this email address")
                    } else {
                        callback();
                    }
                }
            })
        },
        function(callback){
            UserModel.findOne({phoneNumber: userData.phoneNumber, isDeleted : false, role: userData.role}, function(err, data){
                if(err){
                    console.log("dberror userRegister", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        callback("User already exists with this Phone Number")
                    } else {
                        callback();
                    }
                }
            })
        },
        function(callback){
            let user = {
                firstName : userData.firstName,
                lastName : userData.lastName,
                phoneNumber : userData.phoneNumber,
                status : "active",
                role : userData.role,
                email : userData.email
            }
            let pass = userData.password;
            let password = db.generateHash(pass);

            user["password"] = password;
            user["verificationCode"] = verificationCode;
            user["verified"] = false;
            user["status"] = 'inRegistration';
            let userParams = new UserModel(user);
            userParams.save(function(err, data){
                if(err){
                    console.log("dberror userRegister", err);
                    callback("Internal server error");
                } else {
                    userId = data._id;
                    let otpParams = {
                        phoneNumber : '91' + userData.phoneNumber,
                        verificationCode : verificationCode
                    }
                    textLocal.sendOtp(otpParams, function(serr){
                        if(err){
                            callback(serr);
                        } else {
                            callback();
                        }
                    })
                }
            })
        },
        function(callback){
            let emailParams = {
                email : userData.email,
                role : userData.role,
                id : userId
            }
            // eventEmmiters.emit('send_verification_email', emailParams);
            callback();
        }
        ], function(err){
            if(err){
                res.json({
                    code: 400,
                    message: err,
                });
            } else {
                res.json({
                    code: 200,
                    message: "Please verify otp, sent at your phone number",
                    data: userData.phoneNumber
                });
            }
        })
}


exports.forgotpass = function(req, res){
    let params = req.body;
    if(!common.isValid(params.email) || !common.isValid(params.role)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    UserModel.findOne({
        email: params.email,
        isDeleted: false,
        role: params.role,
        verified : true
    }, function(err, data) {
        if (err) {
            console.log("dberror forgotpass", err);
            callback("Internal server error");
        } else {
            if (common.isValid(data)) {
                let token = common.jwtSign({email: data.email, id: data._id});
                var tokenData = {
                    email : data.email,
                    token : token,
                    firstName : data.firstName
                }

                UserModel.updateOne({_id: data._id}, {$set:{passwordToken : token}}, function(err, succ){
                    if(err){
                        res.json({code:400, message:"Internal server error"});
                    } else {
                        forgotPassEmail(tokenData, function(err, succ){
                            if(err){
                                res.json({code:400, message:"Error sending email"});
                            } else {
                                res.json({code: 200, message: "We have sent a email containing link to reset your password", data:[]});
                            }
                        });
                    }
                })
            } else {
                res.json({code:400, message:"User not exists, or your account is not verified"});
            }
        }
    })
}


function forgotPassEmail(data, callback){


    var body = common.getEmailHeader() +
        '                <tr>' +
        '                  <td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0px; margin: 0px;"><a href="' + common.default_set.HOST + '" style="text-decoration: none;" target="_blank"><img width="600" vspace="0" hspace="0" border="0" style="' +
        '           width: 100%;' +
        '       max-width: 600px;' +
        '     color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; 600 border: none; display: block;" title="" alt="f2h" src="' + common.default_set.HOST + '/assets/images/email_images/cover.jpg"></a></td>' +
        '                </tr>' +
        '                   <tr>' +
        '    <td valign="top" align="left" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;' +
        '    padding-top: 25px; ' +
        '   color: #000000;' +
        '    font-family: sans-serif;">Dear ' + data.firstName + ',<br/><br/> We have received a password change request for your account. To reset your password, <a target="_blank" style="text-decoration: underline;' +
        '                   font-family: sans-serif; font-size: 17px; font-weight: 400; line-height: 120%;" href="' + common.default_set.HOST + '/#!/verifyUser/' + data.token + '">go to this page</a>. This link will be active for one hour. </td>' +
        '   </tr>' +
        '<tr>' +
        '    <td valign="top" align="left" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;' +
        '    padding-top: 25px; ' +
        '   color: #000000;' +
        '    font-family: sans-serif;">Thanks<br/>dealStick team</td>' +
        '   </tr>' +
        '                <tr>' +
        '                </tr>' + common.getEmailFooter();



    let mailOptions = {
        from: '"dealStick"', // sender address
        to: data.email, // list of receivers
        subject: 'Password Change Request', // Subject line
        text: 'Change Password', // plain text body
        html: body // html body
    };



    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            callback(true, null);
        } else {
            callback(null, true);
        }
    });
}

exports.checkToken = function(req,res) {
    let token = req.params.token;
    if(!common.isValid(token)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    UserModel.findOne({
        passwordToken: token
    }, function(err, data) {
        if (err) {
            console.log("dberror forgotpass", err);
            callback("Internal server error");
        } else {
            if (common.isValid(data)) {
                // UserModel.update({_id: data._id}, {$unset: {passwordToken: 1 }}, function(err, succ){
                //     if(err){
                //         res.json({code:400, message:"Internal server error"});
                //     } else {
                        res.json({code:200, message:"Success", data: {id: data._id}})
                   // }
                //})
            } else {
                res.json({code:400, message:"This token is expired"});
            }
        }
    })
}

exports.changePassword = function(req, res){
    let userParam = req.body;
    if(!common.isValid(userParam.password) || !common.isValid(userParam.id)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    UserModel.findOne({
        _id: userParam.id,
        isDeleted : false,
        status : 'active'
    }, function(err, data) {
        if (err) {
            console.log("dberror forgotpass", err);
            callback("Internal server error");
        } else {
            if (common.isValid(data)) {
                console.log(userParam.password,"userParam");
                let password = db.generateHash(userParam.password);
                console.log(password,"this is password");
                UserModel.updateOne({_id: userParam.id}, {$set: {password: password }}, function(err, succ){
                    if(err){
                        res.json({code:400, message:"Internal server error"});
                    } else {
                        UserModel.updateOne({_id: userParam.id}, {$unset: {passwordToken: 1 }});
                        res.json({code:200, message:"Success", data:[]})
                    }
                })
            } else {
                res.json({code:400, message:"User is not active"});
            }
        }
    })
}

exports.sendContactEmail = function(req, res){
    let contactData = req.body;
    var body = common.getEmailHeader() +
        '                <tr>' +
        '                  <td valign="top" align="center"  style="border-collapse: collapse; border-spacing: 0px; margin: 0px;"><a href="' + common.default_set.HOST + '" style="text-decoration: none;" target="_blank"><img width="600" vspace="0" hspace="0" border="0" style="' +
        '           width: 100%;' +
        '       max-width: 600px;' +
        '     color: #000000; font-size: 13px; margin: 0; padding: 0; outline: none; text-decoration: none; 600 border: none; display: block;" title="" alt="f2h" src="' + common.default_set.HOST + '/assets/images/email_images/cover.jpg"></a></td>' +
        '                </tr>' +
        '                   <tr>' +
        '    <td valign="top" align="left" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;' +
        '    padding-top: 25px; ' +
        '   color: #000000;' +
        '    font-family: sans-serif;">Dear  dealsTickTeam,<br/><br/>' + contactData.message + '<br/> Sender Name:'+ contactData.name +'<br/> Sender phoneNumber:'+contactData.phoneNumber+'</td>' +
        '   </tr>' +
        '<tr>' +
        '    <td valign="top" align="left" style="border-collapse: collapse; border-spacing: 0; margin: 0; padding: 0; padding-left: 6.25%; padding-right: 6.25%; width: 87.5%; font-size: 17px; font-weight: 400; line-height: 160%;' +
        '    padding-top: 25px; ' +
        '   color: #000000;' +
        '    font-family: sans-serif;">Thanks<br/>dealStick team</td>' +
        '   </tr>' +
        '                <tr>' +
        '                </tr>' + common.getEmailFooter();



    let mailOptions = {
        from: contactData.email, // sender address
        to: 'me.dealstick@gmail.com', // list of receivers
        subject: 'Connection Email', // Subject line
        text: 'Help request', // plain text body
        html: body // html body
    };



    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            res.json({code:400, message:"Internal Server Error"});
        } else {
            res.json({code:200, message: "Your message has been sent Successfully"})
        }
    });
}

exports.verifyOtp = function(req, res){
    let params = req.body;
    let userData = {};
    let token;
    if(!common.isValid(params.userId) || !common.isValid(params.verificationCode)){
        res.json({code: 400, message: 'Invalid request'});
        return;
    }

    async.series([
        function(callback){
            UserModel.findOne({phoneNumber : params.userId, isDeleted: false, role : 'customer'}, {_id: 1, phoneNumber: 1, password:1, firstName: 1, status: 1, role: 1, verified : 1, verificationCode:1}, function(err, data){
                if(err){
                    console.log("dberror verifyOtp", err);
                    callback('Internal server error');
                } else {
                    if(common.isValid(data)){
                        if(data.verified){
                            callback('You are a verified customer, go to login page and singIn');
                        } else {
                            userData = data;
                            callback();
                        }
                    } else {
                        callback('User not exists');
                    }
                }
            })
        }, 
        function(callback) {
            if(common.isValid(userData.verificationCode) && userData.verificationCode == params.verificationCode){
                callback();
            } else {
                callback('Invalid verification code');
            }
        }, 
        function(callback) {
            UserModel.updateOne({_id: mongoose.Types.ObjectId(userData._id)}, {$set: {verified: true, status: 'active'}}, function(err, data){
                if(err){
                    console.log("dberror verifyOtp", err);
                    callback('Internal server error');
                } else {
                    UserModel.updateOne({_id: mongoose.Types.ObjectId(userData._id)}, {$unset: {verificationCode: 1 }}, function(err, succ){
                        userData.status = 'active';
                        userData.verified = true;
                        callback();
                    })
                }
            })
        },
        function(callback) {
            if(userData.status == 'active' && userData.verified){
                let params = {
                    id: userData._id,
                    role: userData.role
                };
                params['firstName'] = userData.firstName || "";
                params['phoneNumber'] = userData.phoneNumber;

                token = common.jwtSign(params);
            } 
            callback();
        }
        ], function(err){
            if(err){
                res.json({code:400, message: err});
            } else {
                res.json({code : 200, message : 'OTP Verified Successfully', token:token,  data: {"firstName": userData.firstName, phoneNumber: userData.phoneNumber}});
            }
        })
}


