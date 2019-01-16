
var mongoose = require('mongoose');
var db = require("../../db.js");
var CmsModel = db.CmsModel();
var MarketingModel = db.MarketingModel();
var common = require("../../config/common.js");

exports.getCms = function(req, res){
	let cmsFor = req.params.cmsfor;
	if(!common.isValid(cmsFor)){
		res.json({code:400, message : "Invalid parameters"});
		return;
	}

	CmsModel.findOne({contentfor: cmsFor},{heading: 1, description: 1}, function(err, data) {
		if(err){
			console.log("dberror getCms", err)
			res.json({code:400, message : "Internal Server error"});
		} else {
			if(!common.isValid(data)){
				res.json({code:400, message : "Content missing"});
			} else {
				res.json({code:200, message : "Success", data: data});
			}
		}
	})
}


exports.marketingContent = function(req, res){
	let queryData = req.body;
	if(queryData.loginUsers){
		MarketingModel.find({loginUsers: true, contentfor: queryData.contentfor, status: true},{heading:1, description: 1}, function(err, data){
			if(err){
				console.log("dberror marketingContent", err);
				res.json({code:400, message: 'Internal Server error'});
			} else {

				if(data.length){
					res.json({code:200, message: 'Success', data: data});
				} else {
					res.json({code:400, message: 'No marketing data'});
				}
			}
		})
	}

	if(queryData.guestUsers){
		MarketingModel.find({guestUsers: true, contentfor: queryData.contentfor, status: true},{heading:1, description: 1}, function(err, data){
			if(err){
				console.log("dberror marketingContent", err);
				res.json({code:400, message: 'Internal Server error'});
			} else {
				if(data.length){
					res.json({code:200, message: 'Success', data: data});
				} else {
					res.json({code:400, message: 'No marketing data'});
				}
			}
		})
	}
}