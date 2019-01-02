var mongoose = require("mongoose");
var db = require("../../db.js");
var UserModel = db.UserModel();
var SystemParamsModel = db.SystemParamsModel();
var common = require("../../config/common.js");
var async = require('async');


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
        streetAddress: 1,
        city: 1,
        state: 1,
        country: 1,
        pincode: 1,
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
	
	if(!common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.email) || !common.isValid(userData.streetAddress) || !common.isValid(userData.city) || !common.isValid(userData.state) || !common.isValid(userData.country) || !common.isValid(userData.pincode)){
		res.json({code: 400, message: "Please enter all the required details"});
		return;
	}

	let userParam = {
		firstName : common.capitalizeFirstLetter(userData.firstName),
		lastName : common.capitalizeFirstLetter(userData.lastName),
		email : userData.email,
		streetAddress : userData.streetAddress,
		city : userData.city,
		state : userData.state,
		country : userData.country,
		pincode : userData.pincode
	}

	userParam.address = userParam.streetAddress + ", " + userParam.city + ", " + userParam.state + ", " + userParam.country + ", " + userParam.pincode; 

	UserModel.update({_id: req.user.id}, userParam, function(err, data) {
		if(err){
			console.log("dberror getUser", updateProfile);
    		res.json({code: 400, message : "Internal server error"});
		} else {
			res.json({code: 200, message : "Profile Saved successfully"});
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
			res.json({code:200, message: "Success", data: {address : data.address}});
		}
	})
}

