var db = require("../../db.js");
var UserModel = db.UserModel();
var common = require("../../config/common.js");
var async = require("async");

exports.login = function(req, res){
	let queryData = req.body;
	if(!common.isValid(queryData.phoneNumber) || !common.isValid(queryData.password) || !common.isValid(queryData.role)){
		res.json({code: 400, message: "Please enter all the fields"});
		return;
	}

	UserModel.findOne({phoneNumber : queryData.phoneNumber, isDeleted : false, role: queryData.role})
			.select({'_id': 1, 'phoneNumber': 1, 'password':1, 'firstName': 1, 'status': 1, 'role': 1})
			.exec(function(err, data){
				if(err){
					console.log("dberror login", err);
					res.json({code:400, message: 'Internal server error'});
				} else {
					let userData = data;
					if(common.isValid(userData)){
						if(db.validPassword(queryData.password, userData.password)){
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
								res.json({code:400, message: "Please verify your phone number"});
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
	if(!common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber) || !common.isValid(userData.password) || !common.isValid(userData.role)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }
    async.series([
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
                role : userData.role
            }
            let pass = userData.password;
            let password = db.generateHash(pass);

            user["password"] = password;
            let userParams = new UserModel(user);
            userParams.save(function(err, data){
                if(err){
                    console.log("dberror userRegister", err);
                    callback("Internal server error");
                    
                } else {
                    callback();
                }
            })
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
                    message: "Registration Successful",
                    data: []
                });
            }
        })
}