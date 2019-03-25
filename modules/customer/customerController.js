var mongoose = require("mongoose");
var db = require("../../db.js");
var UserModel = db.UserModel();
var SystemParamsModel = db.SystemParamsModel();
var common = require("../../config/common.js");
var async = require('async');
const Joi = require('joi');


exports.getUser = function(req, res){
	let phoneNumber = req.params.phone;
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code:400, message: "You are not authorised"});
		return;
	}
	if(!common.isValid(phoneNumber)){
		res.json({code: 400, message: "Parameters missing"});
		return;
	}

    UserModel.findOne({
        _id: req.user.id,
        phoneNumber: phoneNumber,
        status: 'active',
        isDeleted: false
    }, {
        firstName: 1,
        lastName: 1,
        email: 1,
        phoneNumber: 1,
        deliveryAddresses: 1,
        address: 1
    }, function(err, data) {
    	if(err){
    		console.log("dberror getUser", err);
    		res.json({code: 400, message : "Internal server error"});
    	} else {
    		if(common.isValid(data)){
    			res.json({code:200, message: "User fetched successfully", data: data})
    		} else {
    			res.json({code:400, message: "User not exists"});
    		}
    	}
    })
}

exports.updateProfile = function(req, res){

	let userData = req.body;
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code:400, message: "You are not authorised"});
		return;
	}
	
	async.series([
		function(callback) {
			delete userData.deliveryAddresses;
			userData.role = req.user.role;
			callback();
		},
		function(callback){
			const schema = Joi.object().keys({
				_id : Joi.string(),
				phoneNumber : Joi.string(),
                firstName: Joi.string().required(),
                lastName : Joi.string().required(),
                email : Joi.string().allow().optional(),
                address : Joi.object().keys({
                	society : Joi.string().required(),
                    wing : Joi.string().optional(),
                    flatNo : Joi.string().required(),
                    city : Joi.string().required(),
                    state : Joi.string().required(),
                    pincode : Joi.string().required()
                }),
                role : Joi.string().valid(['customer']).required()
            });
            Joi.validate(userData, schema, function(err){
                if(err){
                    console.log(err);
                    callback('Some Parameters are invalid or missing');
                } else {
                    callback();
                }
            });
		},

		function(callback){
			let wing = '';
			let society = (userData.address.society).substring(0,6);
			let flatNo = (userData.address.flatNo);
			if(common.isValid(userData.address.wing)){
				wing = (userData.address.wing).substring(0,1);
			}
			let userId = society + flatNo + ( common.isValid(wing) ? wing : '');
			userData.userId = userId;
			userData.deliveryAddress = flatNo + " " + (common.isValid(userData.address.wing) ? userData.address.wing : '') + userData.address.society + " " + userData.address.city + " " + userData.address.state + " " + userData.address.pincode;
			callback();
		},
		function(callback) {
			let userParam = {
				firstName : common.capitalizeFirstLetter(userData.firstName),
				lastName : common.capitalizeFirstLetter(userData.lastName),
				email : userData.email,
				address : {
					society : userData.address.society,
					flatNo : userData.address.flatNo,
					wing : userData.address.wing || '',
					city : userData.address.city,
					state : userData.address.state,
					pincode : userData.address.pincode
				},
				role : userData.role,
				deliveryAddresses : userData.deliveryAddress,
				userId : userData.userId
			};
			UserModel.update({_id: req.user.id}, userParam, function(err, data) {
				if(err){
					console.log("dberror updateProfile", err);
		    		callback('Internal server error');
				} else {
					callback();
				}
			})
		}
		], function(err){
			if(err){
				res.json({code:400, message: err});
			} else {
				res.json({code:200, message: 'Profile successfully updated'});
			}
		})

}

exports.updatePassword = function(req, res) {
	let passData = req.body;
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code:400, message:"You are not authorised"});
		return;
	}

	if(!common.isValid(passData.oldPass) || !common.isValid(passData.newPass)){
		res.json({code: 400, message: "Enter required Parameters"});
		return;
	}
	if(passData.newPass.length < 6 || passData.newPass.length > 15){
		res.json({code: 400, message: "Password should be 6 to 15 digit long only"});
		return;
	}
	async.series([
		function(callback){
			UserModel.findOne({_id: req.user.id, isDeleted: false, status: 'active'}, {password: 1}, function(err, data){
				if(err){
					console.log("dberror updatePassword", err);
					callback("Internal server error");
				} else {
					if(common.isValid(data)){
						if(db.validPassword(passData.oldPass, data.password)){
							callback();
						} else {
							callback("Please enter correct old-password");
						}
						
					} else {
						callback("User not exists");
					}
				}
			})
		}, function(callback){
            let newPassword = db.generateHash(passData.newPass);
            

            UserModel.update({_id: req.user.id}, {$set: {password: newPassword}}, function(err, data){
            	if(err){
            		console.log("dberror updatePassword", err);
					callback("Internal server error");
            	} else {
            		callback()
            	}
            })
		}
		], function(err){
			if(err){
				res.json({code: 400, message: err});
			} else {
				res.json({code:200, message: "Password updated successfully"});
			}
		})
}

exports.getAddress = function(req, res){
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message: "You are not authorised"});
		return;
	} 

	UserModel.findOne({_id: req.user.id},{address:1}, function(err, data){
		if(err){
			console.log("dberror getAddress", err);
			res.json({code: 400, message: err});
		} else {
			res.json({code:200, message: "Success", data: data.address});
		}
	})
}

