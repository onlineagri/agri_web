var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var UserModel = db.UserModel();
var MenuModel = db.MenuModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');

exports.getNewProducts = function(req, res){
	let menuData = [];
	MenuModel.find({})
		.sort('-created_at')
		.limit(20)
		.exec(function(err, data){
			if(err){
				console.log("dberror getNewProducts", err);
				res.json({code:400, message:"Internal server error"});
			} else {
				if(common.isValid(data) && data.length){
					menuData = data;
					res.json({code:200, message:"Product fetched successfully" , data:data});
				} else {
					res.json({code:400, message:"NO products found"});
				}
			}
		})
}