var mongoose = require("mongoose");
var db = require("../../db.js");
var ServiceModel = db.ServiceModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');

exports.addService = function(req, res){
	let params = req.body;
	if(!common.isValid(params.name) || !common.isValid(params.packages)){
		res.json({code:400, message : "Invalid Parameters"});
		return;
	}

	let saveParams = {
		name : params.name,
		status: common.isValid(params.status) ? params.status : true,
	}
	saveParams.package = [];

	for(let i=0; i <  params.packages.length ; i++){
		saveParams.package.push({
			name : params.packages[i].name,
			days : params.packages[i].days,
			netAmount : params.packages[i].netAmount,
			dealPrice : params.packages[i].dealPrice,
			description : params.packages[i].description,
			status : params.packages[i].status,
		})
	}

	let service = new ServiceModel(saveParams);

	service.save(function(err, data){
		if(err){
			console.log("dberror addService", err);
			res.json({code : 400, message: 'Internal server error'});
		} else {
			res.json({code : 200, message: "Service added successfully"});
		}
	})
}


exports.getServices = function(req, res){
	if(!common.isValid(req.user) || !common.isValid(req.user.id) || req.user.roleId != 'admin'){
		res.json({code: 400, message: "You are unathorised"});
		return;
	}

	ServiceModel.find({isDeleted : false} , function(err, data){
		if(err){
			console.log("dberror addService", err);
			res.json({code : 400, message: 'Internal server error'});
		} else {
			if(common.isValid(data) && data.length){
				res.json({code : 200, message: "Success", data: data});
			} else {
				res.json({code : 400, message: "No data found"});
			}
		}
	})
}