var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var common = require("../../config/common.js");

exports.addCategory = function(req, res){
	let categoryParams = req.body;
	if(!common.isValid(categoryParams.name)){
		res.json({code: 400, message: "Missing required data"});
		return;
	}

	let category = new CategoryModel(categoryParams);
	category.save(function(err, data){
		if(err){
			res.json({code : 400, message: "Internal Server Error"});
		} else {
			res.json({code : 200, message: "Category Added Successfuly", data: []});
		}
	})
}

exports.getCategories = function(req, res) {
	CategoryModel.find()
		.select({'_id': 1, 'name': 1, 'description':1, 'status': 1})
		.exec(function(err, data){
			if(err){
				res.json({code : 400, message: "Internal Server Error"});
			} else {
				res.json({code : 200, message: "Categories Fetched Successfuly", data: data});
			}
		})
}