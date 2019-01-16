var mongoose = require("mongoose");
var db = require("../../db.js");
var MarketingModel = db.MarketingModel();
var common = require("../../config/common.js");
var async = require('async');

exports.addContent = function(req, res){
	let marketingData = req.body;
	if(!common.isValid(marketingData.contentfor) || !common.isValid(marketingData.heading) || !common.isValid(marketingData.description)){
		res.json({code:400, message: 'Invalid parameters'});
		return;
	}

	let saveParams = {
		contentfor : marketingData.contentfor,
		heading : marketingData.heading,
		description : marketingData.description,
		loginUsers : common.isValid(marketingData.loginUsers) ? marketingData.loginUsers : true,
		guestUsers : common.isValid(marketingData.guestUsers) ? marketingData.guestUsers : true,
		status :common.isValid(marketingData.status) ? marketingData.status : true,
	}

	let marketing = new MarketingModel(saveParams);
	marketing.save(function(err, data){
		if(err){
			console.log("dberror addContent", err);
			res.json({code:400, message: 'Internal server error'});
		} else {
			res.json({code: 200, message : 'Marketing Content added successfully'});
		}
	})
}

exports.getContents = function(req, res) {
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message: 'You are Unauthorised'});
		return;
	}

	MarketingModel.find({isDeleted: false}, function(err, data){
		if(err){
			console.log("dberror getContents", err);
			res.json({code:400, message:'Internal server error'});
		} else {
			if(data.length){
				res.json({code:200, message:'Success', data: data});
			} else {
				res.json({code:400, message:'No Content found'});
			}
		}
	})
}

exports.getContentbyId = function(req, res) {
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code:400, message: "Invalid Parameters"});
		return;
	}

	MarketingModel.findOne({isDeleted: false, _id : id}, function(err, data){
		if(err){
			console.log("dberror getContentbyId", err);
			res.json({code:400, message: 'Internal Server error'});
		} else {
			res.json({code:200, message: 'Success', data: data});
		}

	})
}

exports.updateContent = function(req, res) {
	let contentParams = req.body;
	if(!common.isValid(contentParams._id) || !common.isValid(contentParams.contentfor) || !common.isValid(contentParams.heading) || !common.isValid(contentParams.description)){
		res.json({code:400, message: "Invalid Parameters"});
		return;
	} 

	let saveParams = {
		contentfor : contentParams.contentfor,
		heading : contentParams.heading,
		description : contentParams.description,
		loginUsers : common.isValid(contentParams.loginUsers) ? contentParams.loginUsers : true,
		guestUsers : common.isValid(contentParams.guestUsers) ? contentParams.guestUsers : true,
		status :common.isValid(contentParams.status) ? contentParams.status : true,
	}

	
	MarketingModel.update({_id: contentParams._id}, saveParams, function(err, data){
		if(err){
			console.log("dberror addContent", err);
			res.json({code:400, message: 'Internal server error'});
		} else {
			res.json({code: 200, message : 'Marketing Content Updated successfully'});
		}
	})
}

exports.deleteContent = function(req, res){
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code:400, message: "Invalid Parameters"});
		return;
	}

	MarketingModel.remove({_id : id}, function(err, data){
		if(err){
			console.log("dberror getContentbyId", err);
			res.json({code:400, message: 'Internal Server error'});
		} else {
			res.json({code:200, message: 'Success'});
		}

	})
}