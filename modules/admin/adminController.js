var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var common = require("../../config/common.js");
var async =require('async');
var fs = require('fs');

exports.addCategory = function(req, res){
	let categoryParams = req.body;
	let saveParams = {}
	async.series([
        function(callback) {
        	saveParams = {
        		type : categoryParams.type,
        		name : common.capitalizeFirstLetter(categoryParams.name),
        		description : categoryParams.description,
        		status : categoryParams.status,
        	}
        	callback();
            
        },
        function(callback) {
            //validation for unique
	        if (!common.isValid(categoryParams._id)) {
	            CategoryModel.findOne({
	                name: categoryParams.name,
	                isDeleted: false
	            }, function(err, category) {
	                if (err) {
	                    console.log("dberror addCategory", err);
	                    callback("Internal server error");
	                } else {
	                    if (common.isValid(category)) {
	                        callback("This category is already available");
	                    } else {
	                        callback();
	                    }
	                }
	            })
	        } else {
	        	callback();
	        }
        },
        function(callback) {
            var imageName = categoryParams.image;
            if (common.isValid(imageName) && !common.isEmptyString(imageName)) {
                var imageTypeRegularExpression = /\/(.*?)$/;
                var file = {};
                var fileName = common.slugify(categoryParams.name) + "_" + new Date().getTime();
                var imageBuffer = common.decodeBase64Image(categoryParams.image);
                if (imageBuffer == "err") {
                    callback('Not a valid image type');
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                    if (common.isValidImageType(imageTypeDetected.input)) {
                        var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                        imageName = fileName + "." + imageTypeDetected[1];
                        file.path = userUploadedImagePath,
                            file.name = fileName + '.' + imageTypeDetected[1],
                            file.type = imageTypeDetected.input;

                        fs.writeFileSync(file.path, imageBuffer.data);
                        imageName = fileName + '.' + imageTypeDetected[1];
                        // common.verifyBucket(common.S3Buckets.menu, function() {
                        //     common.uploadFile(file, common.S3Buckets.menu, function(err) {
                        //         if (err) {
                        //             callback('Unable to upload file');
                        //         } else {
                        //             uploadFileName = file.name;
                        //             callback();
                        //         }
                        //     });
                        // });
                        saveParams.imageName = file.name;
                        callback();
                    } else {
                        callback('Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.');
                    }
                }
            } else {
                callback();
            }
        },
        function(callback){
        	if(!common.isValid(categoryParams._id)){
        		let categoryData = new CategoryModel(saveParams);
				categoryData.save(function(err, data){
					if(err){
						console.log("dberror addCategory", err);
	        			callback("Internal server error");
					} else {
						callback();
					}
				})
        	} else {
        		let id = categoryParams._id;
        		CategoryModel.update({_id: id}, { $set: saveParams}, function(err, data){
        			if(err){
        				console.log("dberror addCategory", err);
	        			callback("Internal server error");
        			} else {
        				callback();
        			}
        		})
        	}
        }
    ], function(err) {
    	if(err){
    		res.json({code : 400, message: err});
    	} else {
    		res.json({code : 200, message: "Category Added Successfuly", data: []});
    	}  
    });

}

exports.deleteCategory = function(req, res) {
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code: 400, message:"Parameters missing"});
	}
	CategoryModel.update({_id: id}, { $set: {'isDeleted': true}}, function(err, data){
		if(err){
			console.log("dberror addCategory", err);
			res.json({code: 400, message:"Internal server error"});
		} else {
			res.json({code: 200, message:"Category deleted Successfuly", data: []});
		}
	})
	
}


exports.getCategoryById = function(req, res) {
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code: 400, message:"Parameters missing"});
	}
	CategoryModel.findOne({_id: id}, function(err, data){
		if(err){
			console.log("dberror addCategory", err);
			res.json({code: 400, message:"Internal server error"});
		} else {
			console.log(data)
			let resdata = {
				_id: data._id,
				type: data.type,
				name: data.name,
				status: data.status,
				description: data.description,
				imageName: '/uploads/' +data.imageName
			}
			res.json({code: 200, message:"Category Fetched Successfuly", data: resdata});
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

