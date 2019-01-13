
var mongoose = require('mongoose');
var db = require("../../db.js");
var CmsModel = db.CmsModel();
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