const mongoose = require('mongoose');
const db = require("../../db.js");
const CategoryModel = db.CategoryModel();
const UserModel = db.UserModel();
const OrderModel = db.OrderModel();
const CmsModel = db.CmsModel();
const SystemParamsModel = db.SystemParamsModel();
const ProductModel = db.ProductModel();
const ComboModel = db.ComboModel();
const common = require("../../config/common.js");
const async =require('async');
const lodash = require('lodash');
const fs = require('fs');
const sharp = require('sharp');
const eventEmmiters = require('../../config/eventEmmiters.js');
const smsSender = require('../../config/textLocal.js');
const Joi = require('joi');

exports.addCategory = function(req, res){
	let categoryParams = req.body;
	let saveParams = {};
    var uploadFileName;
	async.series([
        function(callback) {
            categoryParams.name = common.capitalizeFirstLetter(categoryParams.name);
            let num = Math.floor(1000 + Math.random() * 9000);
            let subName = (categoryParams.name).substring(0,5);
            categoryParams["cat_id"] = subName + num;
            callback();
        },
        function(callback) {
            const schema = Joi.object().keys({
                name: Joi.string().required(),
                status: Joi.string().valid(['active', 'inactive']).required(),
                image: Joi.string(),
                cat_id : Joi.string().alphanum().min(6).max(10).required()
            });
            Joi.validate(categoryParams, schema, function(err){
                if(err){
                    callback('Some Parameters are invalid or missing');
                } else {
                    callback();
                }
            });
 
        },
        function(callback) {
        	saveParams = {
        		name : categoryParams.name,
        		status : categoryParams.status
        	}
            if(!common.isValid(categoryParams._id)) {
                saveParams['cat_id'] = categoryParams.cat_id;
            }
        	callback();
            
        },
        function(callback) {
            //validation for unique
	        if (!common.isValid(categoryParams._id)) {
	            CategoryModel.findOne({
	                name: categoryParams.name,
                    cat_id: categoryParams.cat_id, 
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
               var fileName = new Date().getTime() + "_" + common.slugify(categoryParams.name);
               var imageBuffer = common.decodeBase64Image(categoryParams.image);
               if (imageBuffer == "err") {
                   callback('Not a valid image type');
               } else {
                   var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                   if (common.isValidImageType(imageTypeDetected.input)) {
                       var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                       sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback()
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath,
                                    file.name = fileName + '.' + imageTypeDetected[1],
                                    file.type = imageTypeDetected.input;
                                    var categoryBucket = common.default_set.DEALSTICK_CATEGORY_BUCKET;
                                    common.verifyBucket(categoryBucket, function() {
                                        common.uploadFile(file, categoryBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                saveParams.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
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
	CategoryModel.update({_id: id}, { $set: {'isDeleted': true, status : 'inactive'}}, function(err, data){
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
			let resdata = {
				_id: data._id,
				name: data.name,
				status: data.status,
				cat_id : data.cat_id,
				imageName: common.default_set.S3_ENDPOINT+ common.default_set.DEALSTICK_CATEGORY_BUCKET + "/" +data.imageName
			}
			res.json({code: 200, message:"Category Fetched Successfuly", data: resdata});
		}
	})
	
}

exports.getCategories = function(req, res) {

	CategoryModel.find({isDeleted: false, status: 'active'})
		.select({'_id': 1, 'name': 1, 'status': 1, 'cat_id' : 1})
		.exec(function(err, data){
			if(err){
				res.json({code : 400, message: "Internal Server Error"});
			} else {
				res.json({code : 200, message: "Categories Fetched Successfuly", data: data});
			}
		})
}

exports.addProduct = function(req, res) {

    const productData = req.body;
    async.series([
        function(callback) {
            productData.name = common.capitalizeFirstLetter(productData.name);
            let num = Math.floor(1000 + Math.random() * 9000);
            let subName = (productData.name).substring(0,5);
            if(!common.isValid(productData.prod_id))
                productData["prod_id"] = subName + num;

            productData['category_id'] = productData.category._id;
            productData['category_name'] = productData.category.name;
            productData['cat_id'] = productData.category.cat_id;
            delete productData.category;

            callback();
        },
        function(callback) {
            const schema = Joi.object().keys({
                name: Joi.string().required(),
                price : Joi.number().required(),
                dealPrice : Joi.number().required(),
                actualPrice : Joi.number().required(),
                category_id : Joi.string().required(),
                category_name : Joi.string().required(),
                cat_id : Joi.string().required(),
                retailer_id : Joi.string().optional(),
                retailer_name : Joi.string().optional(),
                quantity_remaining : Joi.number().optional(),
                quantity : Joi.number().required(),
                price_range : Joi.string().required(),
                stockType : Joi.string().required(),
                isChemicalfree: Joi.boolean().required(),
                description : Joi.string().required(),
                isDaily : Joi.boolean().optional(),
                status: Joi.string().valid(['active', 'inactive']).required(),
                image: Joi.string(),
                prod_id : Joi.string().alphanum().min(6).max(10).required()
            });
            Joi.validate(productData, schema, function(err){
                if(err){
                    callback('Some Parameters are invalid or missing');
                } else {
                    callback();
                }
            });
        },
        function(callback){
            if (!common.isValid(productData._id)) {
                ProductModel.findOne({
                    name: productData.name,
                    prod_id : productData.prod_id,
                    isDeleted: false
                }, function(err, category) {
                    if (err) {
                        console.log("dberror addProduct", err);
                        callback("Internal server error");
                    } else {
                        if (common.isValid(category)) {
                            callback("This menu is already available");
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
            var imageName = productData.image;
            if (common.isValid(imageName) && !common.isEmptyString(imageName)) {
                var imageTypeRegularExpression = /\/(.*?)$/;
                var file = {};
                var fileName = common.slugify(productData.name) + "_" + new Date().getTime();
                var imageBuffer = common.decodeBase64Image(productData.image);
                if (imageBuffer == "err") {
                    callback('Not a valid image type');
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                    if (common.isValidImageType(imageTypeDetected.input)) {
                        var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                        sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath;
                                    file.name = fileName + '.' + imageTypeDetected[1];
                                    file.type = imageTypeDetected.input;

                                    var productBucket = common.default_set.PROD_BUCKET;
                                    common.verifyBucket(productBucket, function() {
                                        common.uploadFile(file, productBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                productData.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
                    } else {
                        callback('Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.');
                    }
                }
            } else {
                callback();
            }
        },
        function(callback){
            var meanQuantiy = 0;
            var meanRemainQty = 0;
            if (common.isValid(productData._id)) {
                ProductModel.findOne({_id: productData._id, prod_id: productData.prod_id}).select({'_id': 1, 'quantity': 1, 'quantity_remaining': 1}).exec(function(err, data){
                    if (err) {
                        console.log('dberror addProduct', err);
                        callback('Internal server error');
                    } else{
                        if(common.isValid(productData.quantity_remaining)){
                            if (productData.quantity_remaining == 0) {
                                productData['quantity_remaining'] = productData.quantity;
                            } else {
                                if (data.quantity > productData.quantity) {
                                    meanQuantiy = data.quantity - productData.quantity;
                                    meanRemainQty = productData.quantity_remaining - meanQuantiy;
                                    productData['quantity_remaining'] = meanRemainQty;
                                }
                                if (data.quantity < productData.quantity) {
                                    meanQuantiy = productData.quantity - data.quantity;
                                    meanRemainQty = productData.quantity_remaining + meanQuantiy;
                                    productData['quantity_remaining'] = meanRemainQty;
                                }
                            }
                        }
                        callback();
                    }
                });
            } else {            
                productData['quantity_remaining'] = productData.quantity;
                callback();
            }
        },
        function(callback){
            if(!common.isValid(productData._id)){
                let menuData = new ProductModel(productData);
                menuData.save(function(err, data){
                    if(err){
                        console.log("dberror addProduct", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            } else {
                let id = productData._id;
                ProductModel.update({_id: id, prod_id: productData.prod_id}, { $set: productData}, function(err, data){
                    if(err){
                        console.log("dberror addProduct", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            }
        }
        ], function(err){
            if(err){
                res.json({code: 400, message: err});
            } else {
                res.json({code: 200, message: 'Product successfully added'});
            }
        })
}

exports.getProducts = function(req, res){
    ProductModel.find({isDeleted: false}, {categoryName:1})
    .select({'_id': 1, 'name': 1, 'description':1, 'status': 1, 'quantity': 1, 'remainingQuantity' : 1, 'price': 1, 'category_name': 1, 'prod_id' : 1,'price_range' : 1, 'quantity_remaining': 1})
    .exec(function(err, data){
        if(err){
            console.log("dberror getAgriMenuList", err);
            res.json({code:400, message: 'Internal server error'});
        } else {
            if(data.length){
                res.json({code:200, message: 'Products fetched successfully', data: data});
            } else {
                res.json({code:400, message: 'No products found'});
            }
        }
    })
}

exports.getProductById = function(req, res) {
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    ProductModel.findOne({_id: id, isDeleted: false}, function(err, data){
        if(err){
            console.log("dberror getMenuById", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            let prodData = {
                _id: data._id,
                category: {name :data.category_name, _id: data.category_id, cat_id : data.cat_id},
                name: data.name,
                status: data.status,
                description: data.description,
                quantity: data.quantity,
                price: data.price,
                dealPrice : data.dealPrice,
                actualPrice : data.actualPrice,
                price_range : data.price_range,
                isChemicalfree : data.isChemicalfree,
                isDaily : data.isDaily,
                imageName: common.default_set.S3_ENDPOINT+ common.default_set.AGRI_PROD_BUCKET + "/" +data.imageName,
                stockType: data.stockType,
                quantity_remaining: data.quantity_remaining,
                prod_id : data.prod_id
            }
            res.json({code: 200, message:"Menu Fetched Successfuly", data: prodData});
        }
    })
    
}


exports.updateProduct = function(req, res) {

    const productData = req.body;
    async.series([
        function(callback) {
            productData.name = common.capitalizeFirstLetter(productData.name);
            productData['category_id'] = productData.category._id;
            productData['category_name'] = productData.category.name;
            productData['cat_id'] = productData.category.cat_id;
            delete productData.category;
            delete productData.imageName;
            callback();
        },
        function(callback) {
            const schema = Joi.object().keys({
                _id: Joi.string().required(),
                name: Joi.string().required(),
                price : Joi.number().required(),
                dealPrice : Joi.number().required(),
                actualPrice : Joi.number().required(),
                category_id : Joi.string().required(),
                category_name : Joi.string().required(),
                cat_id : Joi.string().required(),
                retailer_id : Joi.string().optional(),
                retailer_name : Joi.string().optional(),
                quantity_remaining : Joi.number().optional(),
                quantity : Joi.number().required(),
                price_range : Joi.string().required(),
                stockType : Joi.string().required(),
                isChemicalfree: Joi.boolean().required(),
                description : Joi.string().required(),
                isDaily : Joi.boolean().optional(),
                status: Joi.string().valid(['active', 'inactive']).required(),
                image: Joi.string(),
                prod_id : Joi.string().alphanum().min(6).max(10).required()
            });
            Joi.validate(productData, schema, function(err){
                if(err){
                    callback('Some Parameters are invalid or missing');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            var imageName = productData.image;
            if (common.isValid(imageName) && !common.isEmptyString(imageName)) {
                var imageTypeRegularExpression = /\/(.*?)$/;
                var file = {};
                var fileName = common.slugify(productData.name) + "_" + new Date().getTime();
                var imageBuffer = common.decodeBase64Image(productData.image);
                if (imageBuffer == "err") {
                    callback('Not a valid image type');
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                    if (common.isValidImageType(imageTypeDetected.input)) {
                        var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                        sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath;
                                    file.name = fileName + '.' + imageTypeDetected[1];
                                    file.type = imageTypeDetected.input;

                                    var productBucket = common.default_set.PROD_BUCKET;
                                    common.verifyBucket(productBucket, function() {
                                        common.uploadFile(file, productBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                productData.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
                    } else {
                        callback('Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.');
                    }
                }
            } else {
                callback();
            }
        },
        function(callback){
            var meanQuantiy = 0;
            var meanRemainQty = 0;
            if (common.isValid(productData._id)) {
                ProductModel.findOne({_id: productData._id, prod_id: productData.prod_id}).select({'_id': 1, 'quantity': 1, 'quantity_remaining': 1}).exec(function(err, data){
                    if (err) {
                        console.log('dberror addProduct', err);
                        callback('Internal server error');
                    } else{
                        if(common.isValid(productData.quantity_remaining)){
                            if (productData.quantity_remaining == 0) {
                                productData['quantity_remaining'] = productData.quantity;
                            } else {
                                if (data.quantity > productData.quantity) {
                                    meanQuantiy = data.quantity - productData.quantity;
                                    meanRemainQty = productData.quantity_remaining - meanQuantiy;
                                    productData['quantity_remaining'] = meanRemainQty;
                                }
                                if (data.quantity < productData.quantity) {
                                    meanQuantiy = productData.quantity - data.quantity;
                                    meanRemainQty = productData.quantity_remaining + meanQuantiy;
                                    productData['quantity_remaining'] = meanRemainQty;
                                }
                            }
                        }
                        callback();
                    }
                });
            } 
        },
        function(callback){
            let id = productData._id;
            ProductModel.update({_id: id, prod_id: productData.prod_id}, { $set: productData}, function(err, data){
                if(err){
                    console.log("dberror addProduct", err);
                    callback("Internal server error");
                } else {
                    callback();
                }
            })
        }
        ], function(err){
            if(err){
                res.json({code: 400, message: err});
            } else {
                res.json({code: 200, message: 'Product successfully updated'});
            }
        })
}

exports.deleteProduct = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    ProductModel.update({_id: id}, { $set: {'isDeleted': true}}, function(err, data){
        if(err){
            console.log("dberror deleteProduct", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Product deleted Successfuly"});
        }
    })
}

exports.getCombos = function(req, res) {
    ComboModel.find({
            isDeleted: false
        })
        .select({
            '_id': 1,
            'name': 1,
            'price' : 1,
            'actualPrice' : 1,
            'description' : 1,
            'products' : 1,
            'status' : 1,
            'combo_id' : 1
        })
        .exec(function(err, data) {
            if (err) {
                console.log("dberror getCombos", err);
                res.json({
                    code: 400,
                    message: 'Internal server error'
                });
            } else {
                if (data.length) {
                    res.json({
                        code: 200,
                        message: 'Combos fetched successfully',
                        data: data
                    });
                } else {
                    res.json({
                        code: 400,
                        message: 'No Combos found'
                    });
                }
            }
        })
}

exports.comboProducts = function(req, res){
    ProductModel.find({isDeleted: false, status: 'active'})
    .select({
            '_id': 1,
            'prod_id': 1,
            'name':1,
            'price' : 1
        })
        .exec(function(err, data){
        if(err){
            console.log('dberror comboProducts', err);
            res.json({code: 400, message: 'Internal server error'});
        } else {
            if (data.length) {
                res.json({
                    code: 200,
                    message: 'Combos Products fetched successfully',
                    data: data
                });
            } else {
                res.json({
                    code: 400,
                    message: 'No Combos found'
                });
            }
        }
    })
}

exports.addCombo = function(req, res){
    let comboParam = req.body;
    async.series([
        function(callback){
            comboParam.name = common.capitalizeFirstLetter(comboParam.name);
            let num = Math.floor(1000 + Math.random() * 9000);
            let subName = (comboParam.name).substring(0,5);
            if(!common.isValid(comboParam.combo_id))
                comboParam["combo_id"] = subName + num;
            callback();
        },
        function(callback){
            const schema = Joi.object().keys({
                _id : Joi.string().optional(),
                name: Joi.string().required(),
                price : Joi.number().required(),
                actualPrice : Joi.number().required(),
                comboDiscount : Joi.number().min(1).max(99).required(),
                combo_id : Joi.string().alphanum().min(6).max(10).required(),
                description : Joi.string().required(),
                status: Joi.string().valid(['active', 'inactive']).required(),
                image: Joi.string(),
                products : Joi.array().items(Joi.object().keys({
                    name : Joi.string().required(),
                    price : Joi.number().required(),
                    id : Joi.string().required(),
                    _id : Joi.string(),
                })),
                imageName : Joi.string().optional()
            });
            Joi.validate(comboParam, schema, function(err){
                if(err){
                    console.log(err);
                    callback('Some Parameters are invalid or missing');
                } else {
                    callback();
                }
            });
        },
        function(callback) {
            var imageName = comboParam.image;
            if (common.isValid(imageName) && !common.isEmptyString(imageName)) {
                var imageTypeRegularExpression = /\/(.*?)$/;
                var file = {};
                var fileName = common.slugify(comboParam.name) + "_" + new Date().getTime();
                var imageBuffer = common.decodeBase64Image(comboParam.image);
                if (imageBuffer == "err") {
                    callback('Not a valid image type');
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                    if (common.isValidImageType(imageTypeDetected.input)) {
                        var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                        sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath;
                                    file.name = fileName + '.' + imageTypeDetected[1];
                                    file.type = imageTypeDetected.input;

                                    var productBucket = common.default_set.PROD_BUCKET;
                                    common.verifyBucket(productBucket, function() {
                                        common.uploadFile(file, productBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                comboParam.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
                    } else {
                        callback('Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.');
                    }
                }
            } else {
                callback();
            }
        },
        function(callback){
            const products = [];
            let totalPrice = 0;
            lodash.each(comboParam.products, function(item){
                products.push({name: item.name, price: item.price, id: item.id});
                totalPrice += item.price;
            })
            comboParam['products'] = products;
            comboParam.actualPrice = totalPrice;
            comboParam.price = totalPrice - (totalPrice * comboParam.comboDiscount) / 100;
            callback();
        },
        function(callback){
            if(!common.isValid(comboParam._id)){
                let combo = new ComboModel(comboParam);
                combo.save(function(err, data){
                    if(err){
                        console.log("dberror addCombo", err);
                        callback('Internal server error');
                    } else {
                        callback();
                    }
                })
            } else {
                ComboModel.update(comboParam, function(err){
                    if(err){
                        console.log("dberror addCombo", err);
                        callback('Internal server error');
                    } else {
                        callback();
                    }
                })
            }
            
        }
        ], function(err){
            if(err){
                res.json({code:400, message: err});
            } else {
                let message = comboParam._id ? 'Combo Updated successfully' : 'Combo Added Successfuly';
                res.json({code:200, message: message});
            }
        })
}

exports.getComboById = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code:400, message:'Parameters missing'});
        return;
    }

    ComboModel.findOne({_id: id, isDeleted: false}, function(err, data){
        if(err){
            console.log("dberror getComboById", err);
            res.json({code:400, message: 'Internal server error'});
        } else {
            if(common.isValid(data)){
                let comboData = {
                    _id: data._id,
                    name: data.name,
                    status: data.status,
                    description: data.description,
                    price: data.price,
                    actualPrice : data.actualPrice,
                    imageName: data.imageName,
                    combo_id : data.combo_id,
                    products : data.products,
                    comboDiscount : data.comboDiscount

                }
                res.json({code: 200, message:"Menu Fetched Successfuly", data: comboData});
            }
            else
                res.json({code:400, message:'Combo not available'});
        }
    })
}

exports.deleteComboById = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    ComboModel.update({_id: id}, { $set: {'isDeleted': true}}, function(err, data){
        if(err){
            console.log("dberror deleteComboById", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Combo deleted Successfuly"});
        }
    })
}






exports.getCustomers = function(req, res) {
    UserModel.find({
            isDeleted: false,
            role: 'customer'
        })
        .select({
            '_id': 1,
            'firstName': 1,
            'lastName': 1,
            'status': 1,
            'created_at' : 1,
            'email' : 1,
            'phoneNumber' : 1,
            'address' : 1,
            'deliveryAddresses' : 1

        })
        .exec(function(err, data) {
            if (err) {
                res.json({
                    code: 400,
                    message: "Internal Server Error"
                });
            } else {
                res.json({
                    code: 200,
                    message: "Users Fetched Successfuly",
                    data: data
                });
            }
        })
}

exports.adminUpdateCustomer = function(req, res) {
    let userData = req.body;
    async.series([
        function(callback){
            const schema = Joi.object().keys({
                _id : Joi.string().required(),
                firstName: Joi.string().required(),
                lastName : Joi.string().required(),
                email : Joi.string().optional(),
                phoneNumber : Joi.string().min(10).max(10).required(),
                address : Joi.object().keys({
                    society : Joi.string().required(),
                    wing : Joi.string().optional(),
                    flatNo : Joi.string().required(),
                    city : Joi.string().required(),
                    state : Joi.string().required(),
                    pincode : Joi.string().required()
                }),
                role : Joi.string().required(),
                status : Joi.string().valid(['active', 'suspended', 'inRegistration']).required(),
                userId : Joi.string().required(),
                deliveryAddresses : Joi.string().optional()
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
            UserModel.findOne({phoneNumber: userData.phoneNumber, isDeleted : false, role: "customer"}, function(err, data){
                if(err){
                    console.log("dberror adminUpdateCustomer", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        callback()
                    } else {
                        callback("Customer missing with given credentials");
                    }
                }
            })
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
        function(callback){
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
                status : userData.status,
                userId : userData.userId
            };
            UserModel.update({_id: userData._id}, userParam, function(err, data) {
                if(err){
                    console.log("dberror adminUpdateCustomer", err);
                    callback('Internal server error');
                } else {
                    callback();
                }
            })
        }
        ], function(err){
            if(err){
                res.json({
                    code: 400,
                    message: err,
                });
            } else {
                res.json({
                    code: 200,
                    message: "Customer updated Successfuly",
                    data: []
                });
            }
        })

}






exports.getCustomer = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }

    UserModel.findOne({
            _id: id
        })
        .select({
            '_id': 1,
            'firstName': 1,
            'lastName': 1,
            'status': 1,
            'email': 1,
            'phoneNumber': 1,
            'address': 1,
            'deliveryAddresses' : 1,
            'userId' : 1,
            'role' : 1
        })
        .exec(function(err, data) {
            if (err) {
                res.json({
                    code: 400,
                    message: "Internal Server Error"
                });
            } else {
                let state = {name: data.state};
                let customerData = {
                    '_id': data._id,
                    'firstName': data.firstName,
                    'lastName': data.lastName,
                    'status': data.status,
                    'email': data.email,
                    'phoneNumber': data.phoneNumber,
                    'address': data.address,
                    'deliveryAddresses' : data.deliveryAddresses,
                    'userId' : data.userId,
                    'role': data.role
                }
                res.json({
                    code: 200,
                    message: "User Fetched Successfuly",
                    data: customerData
                });
            }
        })
}

exports.adminDeleteCustomer = function(req, res) {
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    UserModel.update({_id: id}, { $set: {'isDeleted': true}}, function(err, data){
        if(err){
            console.log("dberror adminDeleteCustomer", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Customer deleted Successfuly", data: []});
        }
    })
}

exports.getMenuList = function(req, res) {
    let category = req.params.category;
    if(!common.isValid(category)){
        res.json({code:400, message:'Invalid request'});
        return;
    }

    switch(category){
        case 'Agriculture':
            getAgriMenuList(function(err, data){
                if(err){
                    res.json({code:400, message: err});
                } else {
                    res.json({code:200, message: 'Success', data: data});
                }
            });
            break;
        case 'Clothing':
            getClothingMenuList(function(err, data){
                if(err){
                    res.json({code:400, message: err});
                } else {
                    res.json({code:200, message: 'Success', data: data});
                }
            });
            break;
        default:
            res.json({code:400, message:'No matching Ctaegory Found'})
    }	
}

exports.addMenu = function(req, res){
	let menuParams = req.body;
    let categoryName = menuParams.category.name;
	if(categoryName === 'Agriculture'){
        addAgriMenu(menuParams, function(err){
            if(err){
                res.json({code:400, message: err});
            } else {
                res.json({code:200, message: 'Product Added Successfuly'});
            }
        })
    }

}

exports.getOrder = function(req, res){
    let orderId = req.params.id;
    if(!common.isValid(orderId)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    OrderModel.findOne({orderNumber: orderId}, function(err, orderData){
        if(err){
            console.log("dberror getOrder", err);
            res.json({code:400, message:"Internal server error"});
        } else {
            if(common.isValid(orderData) && lodash.isEmpty(orderData) == false){
                res.json({code:200, message:"Order fetched successfully", data:orderData});
            } else {
                res.json({code:400, message:"Invalid order"});
            }
        }
    })
}


exports.getOrders = function(req, res) {
    if(!common.isValid(req.user) || !common.isValid(req.user.id)){
        res.json({code: 400, message:"You are not authorised to perform this action"});
        return;
    }

    OrderModel.find({}).sort('-created_at').exec(function(err, data){
        if(err){
            console.log("dberror getOrders", err);
            res.json({code:400, message:"Internal server error"});
        } else {
            if(common.isValid(data) && data.length > 0){
                res.json({code:200, message:"Orders fetched successfully", data:data});
            } else {
                res.json({code:200, message:"No orders found", data:[]});
            }
        }
    })
}

exports.updateOrderStatus = function(req, res){
    var record = req.body;
    if(!common.isValid(req.user) || !common.isValid(req.user.id)){
        res.json({code: 400, message:"You are not authorised to perform this action"});
        return;
    }

    OrderModel.findOneAndUpdate({orderNumber: record.orderId}, { $set: { status: record.status }}, {new: true}, function (err, data) {
      if (err) {
        console.log("dberror updateOrderStatus", err);
      } else{
        if (common.isValid(data)) {
            let orderUrl = common.default_set.HOST + "/orderdetails/" + data.orderId;
            let sData = {
                customerPhone : data.customerPhone,
                orderNumber : data.orderNumber,
                status : record.status,
                amountPaid : data.amountPaid
            }
            smsSender.orderStatusUpdate(sData);
            res.json({
                code: 200,
                message: 'Order status changed to ' + data.status,
                data: data.status
            });
        } else{
            res.json({
                code: 400,
                message: 'Order not updated'
            });
        }
      }
    });
}

exports.addClothingMenu = function(req, res){
    let menuParams = req.body;
    let saveParams = {}
    async.series([
        function(callback) {
            saveParams = {
                categoryName : menuParams.category.name,
                categoryId : mongoose.Types.ObjectId(menuParams.category._id),
                name : common.capitalizeFirstLetter(menuParams.name),
                description : menuParams.description,
                status : menuParams.status,
                quantity : menuParams.quantity,
                sellerId : mongoose.Types.ObjectId(menuParams.farmer._id),
                priceEachItem : menuParams.applicationPrice,
                sellerPrice: menuParams.farmerPrice,
                dealPrice : common.isValid(menuParams.dealPrice) ? menuParams.dealPrice: menuParams.applicationPrice,
                sellerName : menuParams.farmer.name,
                stockType: menuParams.stockType,
                brand : common.isValid(menuParams.brand) ? menuParams.brand : menuParams.farmer.name,
                type: common.capitalizeFirstLetter(menuParams.type)
            }
            if(common.isValid(menuParams.size)){
                saveParams['size'] = menuParams.size;
            }
            if(common.isValid(menuParams.colour)){
                saveParams['colour'] = menuParams.colour;
            }
            if(common.isValid(menuParams.packOf)){
                saveParams['packOf'] = menuParams.packOf;
            }
            if(common.isValid(menuParams.fabric)){
                saveParams['fabric'] = menuParams.fabric;
            }
            if(common.isValid(menuParams.sleeve)){
                saveParams['sleeve'] = menuParams.sleeve;
            }
            if(common.isValid(menuParams.pattern)){
                saveParams['pattern'] = menuParams.pattern;
            }
            if(common.isValid(menuParams.styleCode)){
                saveParams['styleCode'] = menuParams.styleCode;
            }
            if(common.isValid(menuParams.closure)){
                saveParams['closure'] = menuParams.closure;
            }
            if(common.isValid(menuParams.fit)){
                saveParams['fit'] = menuParams.fit;
            }
            if(common.isValid(menuParams.collor)){
                saveParams['collor'] = menuParams.collor;
            }
            if(common.isValid(menuParams.fabricCare)){
                saveParams['fabricCare'] = menuParams.fabricCare;
            }
            if(common.isValid(menuParams.suitableFor)){
                saveParams['suitableFor'] = menuParams.suitableFor;
            }
            if(common.isValid(menuParams.pockets)){
                saveParams['pockets'] = menuParams.pockets;
            }
            if(common.isValid(menuParams.outerMaterial)){
                saveParams['outerMaterial'] = menuParams.outerMaterial;
            }
            if(common.isValid(menuParams.soleMaterial)){
                saveParams['soleMaterial'] = menuParams.soleMaterial;
            }
            if(common.isValid(menuParams.weight)){
                saveParams['weight'] = menuParams.weight;
            }
            if(common.isValid(menuParams.remainingQuantity)){
                saveParams['remainingQuantity'] = menuParams.remainingQuantity;
            } else {
                saveParams['remainingQuantity'] = menuParams.quantity;
            }
            callback();
            
        },
        function(callback) {
            //validation for unique
            if (!common.isValid(menuParams._id)) {
                AgricultureModel.findOne({
                    name: menuParams.name,
                    isDeleted: false
                }, function(err, category) {
                    if (err) {
                        console.log("dberror addMenu", err);
                        callback("Internal server error");
                    } else {
                        if (common.isValid(category)) {
                            callback("This menu is already available");
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
            var imageName = menuParams.image;
            var imageTypeRegularExpression = /\/(.*?)$/;
            if (common.isValid(imageName) && imageName.length > 0) {
                lodash.each(imageName, function(image, cb){
                    var file = {};
                    var fileName = new Date().getTime() + "_" + common.slugify(menuParams.name) ;
                    var imageBuffer = common.decodeBase64Image(image);
                    if(imageBuffer == "err"){
                        cb("Not a valid image");
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
                            cb();
                        }
                    }
                })
            }
                /*var imageTypeRegularExpression = /\/(.*?)$/;
                var file = {};
                var fileName = new Date().getTime() + "_" + common.slugify(menuParams.name) ;
                var imageBuffer = common.decodeBase64Image(menuParams.image);
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
            }*/
        },
        function(callback){
            if(!common.isValid(menuParams._id)){
                let menuData = new AgricultureModel(saveParams);
                menuData.save(function(err, data){
                    if(err){
                        console.log("dberror addCategory", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            } else {
                let id = menuParams._id;
                AgricultureModel.update({_id: id}, { $set: saveParams}, function(err, data){
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
            res.json({code : 200, message: "Menu Added Successfuly", data: []});
        }  
    });

}

exports.addContent = function(req, res){
    let contentParams = req.body;
    let saveParams = {};
    let message = '';
    async.series([
        function(callback) {
            saveParams = { 
                contentfor: common.isValid(contentParams.contentfor) ? contentParams.contentfor : '',
                heading: common.isValid(contentParams.heading) ? contentParams.heading : '',
                description: common.isValid(contentParams.description) ? contentParams.description : '',
                status: common.isValid(contentParams.status) ? contentParams.status : false
            }
            callback(); 
        },
        function(callback) {
            //validation for unique
            if (!common.isValid(contentParams._id)) {
                CmsModel.findOne({
                    name: contentParams.contentfor,
                    isDeleted: false
                }, function(err, category) {
                    if (err) {
                        console.log("dberror addContent", err);
                        callback("Internal server error");
                    } else {
                        if (common.isValid(category)) {
                            callback("This content is already available");
                        } else {
                            callback();
                        }
                    }
                })
            } else {
                callback();
            }
        },
        function(callback){
            if(!common.isValid(contentParams._id)){
                let contentData = new CmsModel(saveParams);
                contentData.save(function(err, data){
                    if(err){
                        console.log("dberror addContent", err);
                        callback("Internal server error");
                    } else {
                        message = "Content Added Successfuly";
                        callback();
                    }
                })
            } else {
                let id = contentParams._id;
                CmsModel.update({_id: id}, { $set: saveParams}, function(err, data){
                    if(err){
                        console.log("dberror addContent", err);
                        callback("Internal server error");
                    } else {
                        message = "Content Updated Successfuly";
                        callback();
                    }
                })
            }
        }
    ], function(err) {
        if(err){
            res.json({code : 400, message: err});
        } else {
            res.json({code : 200, message: message, data: []});
        }  
    });

}

exports.getContents = function(req, res){
    CmsModel.find({}).sort('-created_at').exec(function(err, data){
        if(err){
            console.log("dberror getContents", err);
            res.json({code:400, message:"Internal server error"});
        } else {
            if(common.isValid(data) && data.length > 0){
                res.json({code:200, message:"Contents fetched successfully", data:data});
            } else {
                res.json({code:200, message:"No orders found", data:[]});
            }
        }
    })
}

exports.getCmsContent = function(req, res){
    var contentId = req.params.id;
    if(!common.isValid(contentId)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    CmsModel.findOne({_id: contentId}, function(err, data){
        if(err){
            console.log("dberror getCmsContent", err);
            res.json({code:400, message:"Internal server error"});
        } else {
            if(common.isValid(data) && lodash.isEmpty(data) == false){
                res.json({code:200, message:"Content fetched successfully", data:data});
            } else {
                res.json({code:400, message:"No content"});
            }
        }
    })
}

exports.deleteContent = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    CmsModel.findOneAndRemove({_id: id}, function(err, data){
        if(err){
            console.log("dberror deleteContent", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Content deleted Successfuly", data: []});
        }
    })
}


exports.getUsers = function(req, res){
    var data = [];
    if(!common.isValid(req.user) || !common.isValid(req.user.id)){
        res.json({code: 400, message:"You are not authorised to perform this action"});
        return;
    }

    async.series([
        function(callback){
            UserModel.count({
                isDeleted: false,
                role: 'customer'
            }, function (err, result) {
                if (err) {
                    console.log('dberror getUsers', err);
                    callback('Internal server error');
                } else {
                    var obj = {
                        customers : result
                    };
                    data.push(obj);
                    callback();
                }
            });
        },
        function(callback){
            UserModel.count({
                isDeleted: false,
                role: 'farmer'
            }, function (err, result) {
                if (err) {
                    console.log('dberror getUsers', err);
                    callback('Internal server error');
                } else {
                    var obj = {
                        farmers : result
                    };
                    data.push(obj);
                    callback();
                }
            });
        }
        ], function(err){
            if (err) {
                console.log('err', err);
                res.json({code: 400, message:"Internal server error"});
            } else{
                res.json({code: 200, message:"Users fetched Successfuly", data: data});
            }
        });

}

exports.getBusinessPersons = function(req, res) {
    UserModel.aggregate([{
        $match: {
            $and: [{
                role: {
                    $ne: "admin"
                }
            }, {
                role: {
                    $ne: "customer"
                }
            }, {
                isDeleted: false
            }]
        }
    }]).exec(function(err, data) {
        if (err) {
            console.log('dberror getBusinessPersons', err);
            res.json({
                code: 400,
                message: "Internal Server Error"
            });
        } else {
            res.json({
                code: 200,
                message: "Users Fetched Successfuly",
                data: data
            });
        }
    });
}

exports.adminAddBusinessPerson = function(req, res){
    let userData = req.body;
    if(!common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }
    async.series([
        function(callback){
            UserModel.findOne({phoneNumber: userData.phoneNumber, isDeleted : false, role: userData.role}, function(err, data){
                if(err){
                    console.log("dberror adminAddCustomer", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        callback("Business Person already exists with this Phone Number")
                    } else {
                        callback();
                    }
                }
            })
        },
        function(callback){
            let businessPerson = {
                firstName : userData.firstName,
                lastName : userData.lastName,
                phoneNumber : userData.phoneNumber,
                status : "active",
                role : userData.role,
                about: userData.about
            }
            if(common.isValid(userData.email))
                businessPerson["email"] = userData.email;
            if(common.isValid(userData.streetAddress)){
                businessPerson["streetAddress"] = userData.streetAddress;
                businessPerson["deliveryAddresses"] = [{
                    address: userData.streetAddress + " " + (common.isValid(userData.city) ? userData.city : "") + " " + (common.isValid(userData.state) ? userData.state : "") + " " + (common.isValid(userData.country) ? userData.country : "") + " " + (common.isValid(userData.pincode) ? userData.pincode : "")
                }]
            }
            if(common.isValid(userData.city))
                businessPerson["city"] = userData.city;
            if(common.isValid(userData.state))
                businessPerson["state"] = userData.state.name;
            if(common.isValid(userData.country))
                businessPerson["country"] = userData.country; 
            if(common.isValid(userData.pincode))
                businessPerson["pincode"] = userData.pincode;
            let pass = userData.phoneNumber + '@123'
            let password = db.generateHash(pass);

            businessPerson["password"] = password;
            let businessPersonData = new UserModel(businessPerson);
            businessPersonData.save(function(err, data){
                if(err){
                    console.log("dberror adminAddBusinessPerson", err);
                    callback("Internal server error");
                    
                } else {
                    callback();
                }
            })
        }
        ], function(err){
            if(err){
                res.json({
                    code: 400,
                    message: err,
                });
            } else {
                res.json({
                    code: 200,
                    message: "Business Person Saved Successfuly",
                    data: []
                });
            }
        }) 
}

exports.getBusinessPerson = function(req, res) {
    let id = req.params.id;
    if (!common.isValid(id)) {
        res.json({
            code: 400,
            message: "Parameters missing"
        });
        return;
    }

    UserModel.findOne({
        _id: id
    }).exec(function(err, data) {
            let state = {
                name: data.state
            };
            let businessPersonData = {
                '_id': data._id,
                'firstName': data.firstName,
                'lastName': data.lastName,
                'status': data.status,
                'email': data.email,
                'phoneNumber': data.phoneNumber,
                'streetAddress': data.streetAddress,
                'city': data.city,
                'state': state,
                'pincode': data.pincode,
                'deliveryAddresses': data.deliveryAddresses,
                'country': data.country,
                'role': data.role,
                'about': data.about
            }
            res.json({
                code: 200,
                message: "User Fetched Successfuly",
                data: businessPersonData
            });
        })
    }

exports.adminUpdateBusinessPerson = function(req, res){
    let userData = req.body;
    if(!common.isValid(userData._id) || !common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }
    let custData;
    async.series([
        function(callback){
            UserModel.findOne({_id: userData._id, role: userData.role}, function(err, data){
                if(err){
                    console.log("dberror adminUpdateBusinessPerson", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        custData = data;
                        callback()
                    } else {
                        callback("User not exists");
                    }
                }
            })
        },
        function(callback){
            let businessPerson = {
                firstName : userData.firstName,
                lastName : userData.lastName
            }
            if(common.isValid(userData.email))
                businessPerson["email"] = userData.email;
            if(common.isValid(userData.streetAddress)){
                businessPerson["streetAddress"] = userData.streetAddress;
            }
            if(common.isValid(userData.city))
                businessPerson["city"] = userData.city;
            if(common.isValid(userData.state))
                businessPerson["state"] = userData.state.name;
            if(common.isValid(userData.country))
                businessPerson["country"] = userData.country; 
            if(common.isValid(userData.pincode))
                businessPerson["pincode"] = userData.pincode;
            if(common.isValid(userData.status) && lodash.includes(["active", "inRegistration", "suspended"], userData.status))
                businessPerson["status"] = userData.status;
            if (common.isValid(userData.role))
                businessPerson["role"] = userData.role;
            if (common.isValid(userData.about))
                businessPerson["about"] = userData.about;

            UserModel.update({_id: userData._id}, { $set: businessPerson}, function(err, data){
                if(err){
                    console.log("dberror adminUpdateBusinessPerson", err);
                    callback("Internal server error");
                    
                } else {
                    callback();
                }
            })
        }
        ], function(err){
            if(err){
                res.json({
                    code: 400,
                    message: err,
                });
            } else {
                res.json({
                    code: 200,
                    message: "Business Person Updated Successfuly",
                    data: []
                });
            }
        })
}

exports.adminDeleteBusinessPerson = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
    }
    UserModel.update({_id: id},{ $set: {'isDeleted': true}}, function(err, data){
        if(err){
            console.log("dberror adminDeleteBusinessPerson", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Business person deleted Successfuly", data: []});
        }
    })
}

exports.addSubCategory = function(req, res) {
    let categoryParams = req.body;
    let saveParams = {}
    async.series([
        function(callback) {
            saveParams = {
                categoryName : categoryParams.category.name,
                categoryId : mongoose.Types.ObjectId(categoryParams.category._id),
                name : common.capitalizeFirstLetter(categoryParams.name),
                description : categoryParams.description,
                status : categoryParams.status,
            }
            callback();
            
        },
        function(callback) {
            //validation for unique
            if (!common.isValid(categoryParams._id)) {
                SubCategoryModel.findOne({
                    name: categoryParams.name,
                    isDeleted: false
                }, function(err, category) {
                    if (err) {
                        console.log("dberror addSubCategory", err);
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
                var fileName = new Date().getTime() + '_' + common.slugify(categoryParams.name);
                var imageBuffer = common.decodeBase64Image(categoryParams.image);
                if (imageBuffer == "err") {
                    callback('Not a valid image type');
                } else {
                    var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                    if (common.isValidImageType(imageTypeDetected.input)) {
                        var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                        imageName = fileName + "." + imageTypeDetected[1];
                        sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath,
                                    file.name = fileName + '.' + imageTypeDetected[1],
                                    file.type = imageTypeDetected.input

                                    var productBucket = common.default_set.DEALSTICK_CATEGORY_BUCKET;
                                    common.verifyBucket(productBucket, function() {
                                        common.uploadFile(file, productBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                saveParams.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
                        
                        //scallback();
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
                let categoryData = new SubCategoryModel(saveParams);
                categoryData.save(function(err, data){
                    if(err){
                        console.log("dberror addSubCategory", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            } else {
                let id = categoryParams._id;
                SubCategoryModel.update({_id: id}, { $set: saveParams}, function(err, data){
                    if(err){
                        console.log("dberror addSubCategory", err);
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
            res.json({code : 200, message: "Sub-Category Added Successfuly", data: []});
        }  
    });
}

exports.getSubCategories = function(req, res) {
    SubCategoryModel.find({
            isDeleted: false
        })
        .select({
            '_id': 1,
            'name': 1,
            'description': 1,
            'status': 1,
            'categoryName': 1,
            'categoryId': 1
        })
        .exec(function(err, data) {
            if (err) {
                res.json({
                    code: 400,
                    message: "Internal Server Error"
                });
            } else {
                res.json({
                    code: 200,
                    message: "Sub-Categories Fetched Successfuly",
                    data: data
                });
            }
        })
}

exports.getDeliveryCharges = function(req, res){
    if(!common.isValid(req.user) || !common.isValid(req.user.id)){
        res.json({code: 400, message:"You are not authorised to perform this action"});
        return;
    }

    SystemParamsModel.find({}).exec(function(err, data){
        if (err) {
            console.log('dberror getDeliveryCharges', err);
            res.json({
                code: 400,
                message: "Internal Server Error"
            });
        } else{
            res.json({
                code: 200,
                message: "Systemparams fetched successfully",
                data: data
            });
        }
    });

}

exports.updateDeliveryCharges = function(req, res){
    var systemParams = req.body;
    var saveParams = {};
    if(!common.isValid(req.user) || !common.isValid(req.user.id)){
        res.json({code: 400, message:"You are not authorised to perform this action"});
        return;
    }
    saveParams = {
        deliveryPercentage : common.isValid(systemParams.deliveryPercentage) ? systemParams.deliveryPercentage : 0,
        deliveryPrice : common.isValid(systemParams.deliveryPrice) ? systemParams.deliveryPrice : 0,
        gstCharges : common.isValid(systemParams.gstCharges) ? systemParams.gstCharges : 0,
        minPerchaseAmt : common.isValid(systemParams.minPerchaseAmt) ? systemParams.minPerchaseAmt : 0,
        productsPerPerson : common.isValid(systemParams.productsPerPerson) ? systemParams.productsPerPerson : 0
    }

    SystemParamsModel.update({type: 'system_parameters'}, { $set: saveParams}, function(err, data){
        if (err) {
            console.log('dberror updateDeliveryCharges', err);
            res.json({
                code: 400,
                message: "Internal Server Error"
            });
        } else{
            res.json({
                code: 200,
                message: "Systemparams updated successfully",
                data: []
            });
        }
    });
}

function getAgriMenuList(callback){
    AgricultureModel.find({isDeleted: false}, {type:1})
    .select({'_id': 1, 'name': 1, 'description':1, 'status': 1, 'quantity': 1, 'remainingQuantity' : 1, 'priceEachItem': 1, 'categoryName': 1, 'farmerName':1})
    .exec(function(err, data){
        if(err){
            console.log("dberror getAgriMenuList", err);
            callback("Internal Server Error");
        } else {
            if(data.length){
                callback(false, data)
            } else {
                callback("No products found")
            }
        }
    })
}

function getClothingMenuList(callback){
    ClothingModel.find({isDeleted: false}, {type:1})
    .select({'_id': 1, 'name': 1, 'description':1, 'status': 1, 'quantity': 1, 'remainingQuantity' : 1, 'priceEachItem': 1, 'categoryName': 1, 'providerName':1})
    .exec(function(err, data){
        if(err){
            console.log("dberror getClothingMenuList", err);
            callback("Internal Server Error");
        } else {
            if(data.length){
                callback(false, data)
            } else {
                callback("No products found")
            }
        }
    })
}

function addAgriMenu(menuParams, cb){
    let saveParams = {};
    var uploadFileName;
    async.series([
        function(callback) {
            saveParams = {
                categoryName : menuParams.category.name,
                categoryId : mongoose.Types.ObjectId(menuParams.category._id),
                name : common.capitalizeFirstLetter(menuParams.name),
                description : menuParams.description,
                status : menuParams.status,
                quantity : menuParams.quantity,
                farmerId : mongoose.Types.ObjectId(menuParams.farmer._id),
                priceEachItem : menuParams.applicationPrice,
                farmerPrice: menuParams.farmerPrice,
                dealPrice : common.isValid(menuParams.dealPrice) ? menuParams.dealPrice: menuParams.applicationPrice,
                farmerName : menuParams.farmer.name,
                stockType: menuParams.stockType,
                brand : common.isValid(menuParams.brand) ? menuParams.brand : menuParams.farmer.name,
                type: common.capitalizeFirstLetter(menuParams.type),
                isOrganic : menuParams.isOrganic,
                holesaleprice : menuParams.holesaleprice,
                holesalequantity : menuParams.holesalequantity,
                farmerEmail : menuParams.farmer.email

            }
            callback();
            
        },
        function(callback) {
            //validation for unique
            if (!common.isValid(menuParams._id)) {
                AgricultureModel.findOne({
                    name: menuParams.name,
                    isDeleted: false
                }, function(err, category) {
                    if (err) {
                        console.log("dberror addAgriMenu", err);
                        callback("Internal server error");
                    } else {
                        if (common.isValid(category)) {
                            callback("This menu is already available");
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
           var imageName = menuParams.image;
           if (common.isValid(imageName) && !common.isEmptyString(imageName)) {
               var imageTypeRegularExpression = /\/(.*?)$/;
               var file = {};
               var fileName = common.slugify(menuParams.name) + "_" + new Date().getTime();
               var imageBuffer = common.decodeBase64Image(menuParams.image);
               if (imageBuffer == "err") {
                   callback('Not a valid image type');
               } else {
                   var imageTypeDetected = imageBuffer.type.match(imageTypeRegularExpression); //get image type
                   if (common.isValidImageType(imageTypeDetected.input)) {
                       var userUploadedImagePath = "./uploads/" + fileName + '.' + imageTypeDetected[1]; // tmp image path
                       sharp(imageBuffer.data)
                            .resize(512, 312)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath,
                                    file.name = fileName + '.' + imageTypeDetected[1],
                                    file.type = imageTypeDetected.input

                                    var productBucket = common.default_set.AGRI_PROD_BUCKET;
                                    common.verifyBucket(productBucket, function() {
                                        common.uploadFile(file, productBucket, function(err) {
                                            if (err) {
                                                fs.unlink(userUploadedImagePath);
                                                return callback(err);
                                            } else {
                                                uploadFileName = file.name;
                                                saveParams.imageName = uploadFileName;
                                                fs.unlink(userUploadedImagePath);
                                                callback();
                                            }
                                        });
                                    });
                                }
                            });
                   } else {
                       callback('Uploaded file is not a valid image. Only JPG, PNG and GIF files are allowed.');
                   }
               }
           } else {
               callback();
           }
        },
        function(callback){
            var meanQuantiy = 0;
            var meanRemainQty = 0;
            if (common.isValid(menuParams._id)) {
                AgricultureModel.findOne({_id: menuParams._id}).select({'_id': 1, 'quantity': 1, 'remainingQuantity': 1}).exec(function(err, data){
                    if (err) {
                        console.log('dberror addAgriMenu', err);
                        callback('Internal server error');
                    } else{
                        if(common.isValid(menuParams.remainingQuantity)){
                            if (menuParams.remainingQuantity == 0) {
                                saveParams['remainingQuantity'] = menuParams.quantity;
                            } else {
                                if (data.quantity > menuParams.quantity) {
                                    meanQuantiy = data.quantity - menuParams.quantity;
                                    meanRemainQty = menuParams.remainingQuantity - meanQuantiy;
                                    saveParams['remainingQuantity'] = meanRemainQty;
                                }
                                if (data.quantity < menuParams.quantity) {
                                    meanQuantiy = menuParams.quantity - data.quantity;
                                    meanRemainQty = menuParams.remainingQuantity + meanQuantiy;
                                    saveParams['remainingQuantity'] = meanRemainQty;
                                }
                            }
                        }
                        callback();
                    }
                });
            } else {            
                saveParams['remainingQuantity'] = menuParams.quantity;
                callback();
            }
        },
        function(callback){
            if(!common.isValid(menuParams._id)){
                let menuData = new AgricultureModel(saveParams);
                menuData.save(function(err, data){
                    if(err){
                        console.log("dberror addAgriMenu", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            } else {
                let id = menuParams._id;
                AgricultureModel.update({_id: id}, { $set: saveParams}, function(err, data){
                    if(err){
                        console.log("dberror addAgriMenu", err);
                        callback("Internal server error");
                    } else {
                        callback();
                    }
                })
            }
        }
    ], function(err) {
        if(err){
            cb(err);
        } else {
            cb(false, "Success")
        }  
    });
}