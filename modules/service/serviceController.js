var mongoose = require("mongoose");
var db = require("../../db.js");
var ServiceModel = db.ServiceModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');

exports.addService = function(req, res){
	let params = req.body;
	if(!common.isValid(params.name) || !common.isValid(params.package)){
		res.json({code:400, message : "Invalid Parameters"});
		return;
	}

	let saveParams = {
		name : params.name,
		status: common.isValid(params.status) ? params.status : true,
	}
	saveParams.package = [];

	for(let i=0; i <  params.package.length ; i++){
		saveParams.package.push({
			name : params.package[i].name,
			days : params.package[i].days,
			netAmount : params.package[i].netAmount,
			dealPrice : params.package[i].dealPrice,
			description : params.package[i].description,
			status : params.package[i].status,
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

exports.getService = function(req, res){
	let serviceId = req.params.id;
	if(!common.isValid(serviceId)){
		res.json({code : 400, message: 'Invalid Parameters'});
		return;
	}

	ServiceModel.findOne({_id: serviceId, isDeleted: false}, {name: 1, status: 1, package:1 }, function(err, data){
		if(err){
			console.log("dberror getService", err);
			res.json({code:400, message:'Internal server error'});
		} else {
			if(common.isValid(data)){
				res.json({code : 200, message: 'Success', data: data});
			} else {
				res.json({code:400, message:'Service not found'});
			}
		}
	})
}

exports.updateService = function(req, res){
	let params = req.body;
	if(!common.isValid(params._id) || !common.isValid(params.name) || !common.isValid(params.package)){
		res.json({code:400, message : "Invalid Parameters"});
		return;
	}

	ServiceModel.update(params, function(err, data){
		if(err){
			console.log("dberror updateService", err);
			res.json({code : 400, message: 'Internal server error'});
		} else {
			res.json({code : 200, message: "Service Updated successfully"});
		}
	})
}