var mongoose = require('mongoose');
var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var UserModel = db.UserModel();
var MenuModel = db.MenuModel();
var OrderModel = db.OrderModel();
var CmsModel = db.CmsModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');
var fs = require('fs');
const sharp = require('sharp');

exports.addCategory = function(req, res){
	let categoryParams = req.body;
	let saveParams = {};
    var uploadFileName;
	async.series([
        function(callback) {
        	saveParams = {
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
                       sharp(imageBuffer.data)
                            .resize(512)
                            .toFile(userUploadedImagePath, (err, info) => {
                                if (err) {
                                    console.log('error sharp', err);
                                    callback('Unable to upload image')
                                } else {
                                    // console.log('image info', info);
                                    file.path = userUploadedImagePath,
                                    file.name = fileName + '.' + imageTypeDetected[1],
                                    file.type = imageTypeDetected.input

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
			let resdata = {
				_id: data._id,
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

	CategoryModel.find({isDeleted: false})
		.select({'_id': 1, 'name': 1, 'description':1, 'status': 1})
		.exec(function(err, data){
			if(err){
				res.json({code : 400, message: "Internal Server Error"});
			} else {
				res.json({code : 200, message: "Categories Fetched Successfuly", data: data});
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
            'streetAddress' : 1,
            'city' : 1,
            'state' : 1,
            'pincode': 1,

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

exports.adminAddCustomer = function(req, res) {
    let userData = req.body;
    if(!common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }
    async.series([
        function(callback){
            UserModel.findOne({phoneNumber: userData.phoneNumber, isDeleted : false, role: "customer"}, function(err, data){
                if(err){
                    console.log("dberror adminAddCustomer", err);
                    callback("Internal server error");
                } else {
                    if(common.isValid(data)){
                        callback("Customer already exists with this Phone Number")
                    } else {
                        callback();
                    }
                }
            })
        },
        function(callback){
            let customer = {
                firstName : userData.firstName,
                lastName : userData.lastName,
                phoneNumber : userData.phoneNumber,
                status : "active",
                role : "customer"
            }
            if(common.isValid(userData.email))
                customer["email"] = userData.email;
            if(common.isValid(userData.streetAddress)){
                customer["streetAddress"] = userData.streetAddress;
                customer["deliveryAddresses"] = [{
                    address: userData.streetAddress + " " + (common.isValid(userData.city) ? userData.city : "") + " " + (common.isValid(userData.state) ? userData.state : "") + " " + (common.isValid(userData.country) ? userData.country : "") + " " + (common.isValid(userData.pincode) ? userData.pincode : "")
                }]
            }
            if(common.isValid(userData.city))
                customer["city"] = userData.city;
            if(common.isValid(userData.state))
                customer["state"] = userData.state.name;
            if(common.isValid(userData.country))
                customer["country"] = userData.country; 
            if(common.isValid(userData.pincode))
                customer["pincode"] = userData.pincode;
            let pass = userData.phoneNumber + '@123'
            let password = db.generateHash(pass);

            customer["password"] = password;
            let customerData = new UserModel(customer);
            customerData.save(function(err, data){
                if(err){
                    console.log("dberror adminAddCustomer", err);
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
                    message: "Customer Saved Successfuly",
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
            'streetAddress': 1,
            'city': 1,
            'state': 1,
            'pincode': 1,
            'deliveryAddresses' : 1,
            'country': 1
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
                    'streetAddress': data.streetAddress,
                    'city': data.city,
                    'state': state,
                    'pincode': data.pincode,
                    'deliveryAddresses' : data.deliveryAddresses,
                    'country' : data.country
                }
                res.json({
                    code: 200,
                    message: "User Fetched Successfuly",
                    data: customerData
                });
            }
        })
}

exports.adminUpdateCustomer = function(req, res){
    let userData = req.body;
    if(!common.isValid(userData._id) || !common.isValid(userData.firstName) || !common.isValid(userData.lastName) || !common.isValid(userData.phoneNumber)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }
    let custData;
    async.series([
        function(callback){
            UserModel.findOne({_id: userData._id, role: "customer"}, function(err, data){
                if(err){
                    console.log("dberror adminUpdateCustomer", err);
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
            let customer = {
                firstName : userData.firstName,
                lastName : userData.lastName
            }
            if(common.isValid(userData.email))
                customer["email"] = userData.email;
            if(common.isValid(userData.streetAddress)){
                customer["streetAddress"] = userData.streetAddress;
            }
            if(common.isValid(userData.city))
                customer["city"] = userData.city;
            if(common.isValid(userData.state))
                customer["state"] = userData.state.name;
            if(common.isValid(userData.country))
                customer["country"] = userData.country; 
            if(common.isValid(userData.pincode))
                customer["pincode"] = userData.pincode;
            if(common.isValid(userData.status) && lodash.includes(["active", "inRegistration", "suspended"], userData.status))
                customer["status"] = userData.status;

            UserModel.update({_id: userData._id}, { $set: customer}, function(err, data){
                if(err){
                    console.log("dberror adminUpdateCustomer", err);
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
                    message: "Customer Updated Successfuly",
                    data: []
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
    /*MenuModel.aggregate([
        { "$match": {isDeleted: false} },
        {
            $group: {
                _id: '$categoryName',
                menu: { $push: "$$ROOT" } 
            }
        }
    ], function (err, result) {
        if (err) {
            console.log("dberror getMenuList", err);
            res.json({code : 400, message: "Internal Server Error"});
        } else {
            res.json({code : 200, message: "Menus Fetched Successfuly", data: result});
        }
    });*/

	MenuModel.find({isDeleted: false})
		.select({'_id': 1, 'name': 1, 'description':1, 'status': 1, 'quantity': 1, 'remainingQuantity' : 1, 'priceEachItem': 1, 'categoryName': 1, 'farmerName':1})
		.exec(function(err, data){
			if(err){
				res.json({code : 400, message: "Internal Server Error"});
			} else {
				res.json({code : 200, message: "Menus Fetched Successfuly", data: data});
			}
		})
}

exports.addMenu = function(req, res){
	let menuParams = req.body;
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
                isOrganic : menuParams.isOrganic

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
	            MenuModel.findOne({
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
                            .resize(512)
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
        	if(!common.isValid(menuParams._id)){
        		let menuData = new MenuModel(saveParams);
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
        		MenuModel.update({_id: id}, { $set: saveParams}, function(err, data){
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

exports.getMenuById = function(req, res) {
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code: 400, message:"Parameters missing"});
	}
	MenuModel.findOne({_id: id}, function(err, data){
		if(err){
			console.log("dberror getMenuById", err);
			res.json({code: 400, message:"Internal server error"});
		} else {
			let resdata = {
				_id: data._id,
				category: {name :data.categoryName, _id: data.categoryId},
				name: data.name,
				status: data.status,
				description: data.description,
				quantity: data.quantity,
				farmerId: data.farmerId,
				priceEachItem: data.priceEachItem,
				imageName: '/uploads/' +data.imageName,
                farmer : {_id: data.farmerId, name: data.farmerName},
                stockType: data.stockType,
                farmerPrice : data.farmerPrice,
                dealPrice: data.dealPrice,
                remainingQuantity: data.remainingQuantity,
                applicationPrice: data.priceEachItem
			}
			res.json({code: 200, message:"Menu Fetched Successfuly", data: resdata});
		}
	})
	
}

exports.deleteMenu = function(req, res) {
	let id = req.params.id;
	if(!common.isValid(id)){
		res.json({code: 400, message:"Parameters missing"});
	}
	MenuModel.update({_id: id}, { $set: {'isDeleted': true}}, function(err, data){
		if(err){
			console.log("dberror deleteMenu", err);
			res.json({code: 400, message:"Internal server error"});
		} else {
			res.json({code: 200, message:"Menu deleted Successfuly", data: []});
		}
	})
	
}

exports.getFarmerList = function(req, res) {
    
    UserModel.aggregate([
        { "$match": {role: "farmer", isDeleted: false, status: "active"} },
        {
            $project: { name: { $concat: [ "$firstName", "  ", "$lastName" ] } }

        }

    ], function (err, result) {
        if (err) {
            console.log("dberror getFarmerList", err);
            res.json({code : 400, message: "Internal Server Error"});
        } else {
            res.json({code: 200, message: "Fetched Successfuly", data: result});
        }
    });
}

exports.getOrder = function(req, res){
    let orderId = req.params.id;
    if(!common.isValid(orderId)){
        res.json({code:400, message:"Parameters missing"});
        return;
    }

    OrderModel.findOne({orderId: orderId}, function(err, orderData){
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

    OrderModel.findOneAndUpdate({orderId: record.orderId}, { $set: { status: record.status }}, {new: true}, function (err, data) {
      if (err) {
        console.log("dberror updateOrderStatus", err);
      } else{
        if (common.isValid(data)) {
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
                MenuModel.findOne({
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
                let menuData = new MenuModel(saveParams);
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
                MenuModel.update({_id: id}, { $set: saveParams}, function(err, data){
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

exports.getBusinessPerson = function(req, res){
    let id = req.params.id;
    if(!common.isValid(id)){
        res.json({code: 400, message:"Parameters missing"});
        return;
    }

    UserModel.findOne({
            _id: id
        }).exec(function(err, data) {
            if (err) {
                res.json({
                    code: 400,
                    message: "Internal Server Error"
                });
            } else {
                let state = {name: data.state};
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
                    'deliveryAddresses' : data.deliveryAddresses,
                    'country' : data.country,
                    'role' : data.role,
                    'about' : data.about
                }
                res.json({
                    code: 200,
                    message: "User Fetched Successfuly",
                    data: businessPersonData
                });
            }
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
    UserModel.findOneAndRemove({_id: id}, function(err, data){
        if(err){
            console.log("dberror adminDeleteBusinessPerson", err);
            res.json({code: 400, message:"Internal server error"});
        } else {
            res.json({code: 200, message:"Business person deleted Successfuly", data: []});
        }
    })
}
