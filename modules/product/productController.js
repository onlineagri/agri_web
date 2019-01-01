var mongoose = require("mongoose");
var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var UserModel = db.UserModel();
var MenuModel = db.MenuModel();
var CartModel = db.CartModel();
var SubCategoryModel = db.SubCategoryModel();
var ReviewModel = db.ReviewModel();
var SystemParamsModel = db.SystemParamsModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');

exports.getNewProducts = function(req, res){
	let menuData = [];

    MenuModel.aggregate([
    {
    	$match: {
            $and: [{
                isDeleted: false,
                status: true
            }]
        }
    },
	{
	  $unwind: "$categoryId"
	},
    {
        $lookup: {
            from: "categorys",
            localField: "categoryId",
            foreignField: "_id",
            as: "product_docs"
        }
    },
    { $sort : {created_at : -1} },
    { $limit: 20 },
    { $project : { _id : 1 , name : 1, categoryName: 1, imageName: 1, priceEachItem: 1, stockType: 1, brand: 1, 'product_docs.type' : 1, farmerName: 1, farmerId: 1, type: 1, isOrganic: 1} }
    ]).exec(function(err, data){
    	if(err){
			console.log("dberror getNewProducts", err);
			res.json({code:400, message:"Internal server error"});
		} else {
			if(common.isValid(data) && data.length){
				menuData = data;
				let imageUrl = common.default_set.S3_ENDPOINT+ common.default_set.AGRI_PROD_BUCKET;
				res.json({code:200, message:"Product fetched successfully" , data: {data : data, imageUrl: imageUrl}});
			} else {
				res.json({code:400, message:"NO products found"});
			}
		}
    })
}

exports.getproduct = function(req, res){
    if (!common.isValid(req.params.id)) {
        res.json({
            code: 400,
            message: "Parameters missing"
        });
        return;
    }

    let id = mongoose.Types.ObjectId(req.params.id);
    let productData = {};
    let rateData = {};
    async.series([
    	function(callback){
    		 MenuModel.aggregate([

		        {
		            $unwind: "$categoryId"
		        }, {
		            $lookup: {
		                from: "categorys",
		                localField: "categoryId",
		                foreignField: "_id",
		                as: "product_docs"
		            }
		        }, {
		            $unwind: "$farmerId"
		        }, {
		            $lookup: {
		                from: "users",
		                localField: "farmerId",
		                foreignField: "_id",
		                as: "user_docs"
		            }
		        }, 
		        {
		            $match: {
		                $and: [{
		                    "_id": id,
		                    isDeleted: false,
		                    status: true
		                }]
		            }
		        }, {
		            $project: {
		                _id: 1,
		                name: 1,
		                categoryName: 1,
		                imageName: 1,
		                priceEachItem: 1,
		                stockType: 1,
		                brand: 1,
		                'product_docs.type': 1,
		                'product_docs.description': 1,
		                'user_docs.email':1,
		                'user_docs.streetAddress': 1,
		                'user_docs.city': 1,
		                'user_docs.pincode': 1,
		                'user_docs.about': 1,
		                farmerName: 1,
		                description: 1,
		                dealPrice: 1,
		                quantity: 1,
		                remainingQuantity: 1,
		                farmerId : 1,
		                type: 1,
		                isOrganic: 1,
		            }
		        }
		    ]).exec(function(err, data) {
		        if (err) {
		            console.log("dberror getproduct",err);
		            callback("Internal server error");
		        } else {
		            if(common.isValid(data) && data.length > 0){
		            	data[0].imageName = common.default_set.S3_ENDPOINT+ common.default_set.AGRI_PROD_BUCKET + "/" + data[0].imageName;
		            	productData = data[0];
		            	callback()
		        	}else{
		        		callback("Product not found");
		        	}
		        }
		    })
    	},
    	function(callback){
    		ReviewModel.aggregate([
    			{
		            $match: {
		                $and: [{
		                    productId: productData._id,
		                    isDeleted: false,
		                    status: true
		                }]
		            }
		        },
		        
		        {
		        	$group: {
		        		_id: null, avgrating: {$avg: "$rating"}, mycount: {$sum: 1}
		        	}
		        },
		        {
		        	$project: {
		        		review: 1,
		        		rating: 1,
		        		avgrating : 1,
		        		productId : 1,
		        		mycount : 1
		            }
		        }
    			]).exec(function(err, rdata){
    				if(err){
    					console.log("dberror getproduct",err);
		            	callback();
    				} else {
    					if(rdata.length)
    						rateData = rdata[0];
    					callback();
    				}
    			})
    	},
    	function(callback){
    		ReviewModel.find({productId: productData._id, status: true, isDeleted : false},{rating:1, review: 1}, {$limit: 15}, function(err, reviewdata){
    			if(err){
    				console.log("dberror getproduct",err);
		            callback();
    			} else {
    				if(reviewdata.length){
    					productData.reviews = reviewdata;
    					productData.rating = rateData.avgrating;
    					productData.reviewCount = rateData.mycount;
    				}
    				callback();
    			}
    		})
    	}
    	], function(err){
    		if(err){
    			res.json({code:400, message: err});
    		} else {
    			res.json({code:200, message: "Product fetched successfully", data: productData});
    		}
    	})
   
}

exports.addToCart = function(req, res){
	let cartData = req.body;
	if(!common.isValid(cartData.id) || !common.isValid(cartData.name) || !common.isValid(cartData.farmerName) || !common.isValid(cartData.priceEachItem) ||!common.isValid(cartData.quantity)){
		res.json({code:400, message: "Parameters missing"});
		return;
	}

	if(!common.isValid(req.user)){
		res.json({code:400, message: "Need to login to perform this action"});
		return;
	}

	let userId = req.user.id;
	let customerName = req.user.fullName;
	let customerPhoneNUmber = req.user.phoneNumber;
	let customerEmail = req.user.email; 
	let menuDataA = {};
	let cart = {};
	let cartCount = 0;
	let cartId;
	let userCart = {};
	async.series([
		
		function(callback){
			MenuModel.findOne({_id: mongoose.Types.ObjectId(cartData.id), status: true, isDeleted: false}, function(err, menuData){
				if(err){
					console.log("dberror addToCart", err);
					callback("Internal server error");
				} else {
					if(common.isValid(menuData) && lodash.isEmpty(menuData) == false){
						menuDataA = menuData;
						callback();
					} else {
						callback("This product is not available, please try after sometime");
					}
				}
			})
		},
		function(callback){
			CartModel.findOne({customerId: mongoose.Types.ObjectId(userId)}, function(err, cdata){
				if(err){
					console.log("dberror addToCart", err);
					callback("Internal server error");
				} else {
					if(common.isValid(cdata)){
						cartId = cdata._id;
						userCart = cdata;
						cartCount = cdata.products.length;
						var cartprod = lodash.filter(cdata.products,{id: menuDataA._id});

						if(cartprod.length > 0){
							callback("This product is already in cart");
						} else {
							callback();
						}		
					} else {
						callback();
					}
				}
			})
		},
		function(callback) {
			if(cartData.priceEachItem != menuDataA.priceEachItem || cartData.dealPrice != menuDataA.dealPrice || cartData.quantity > menuDataA.remainingQuantity){
				callback("This product is currently out of stock, please try after sometime");
			} else {
				callback();
			}
		}, 
		function(callback){
			if(!common.isValid(cartId)){
				cart = {
					customerId : userId,
					orderNetAmount : parseInt(cartData.quantity) * parseFloat(menuDataA.dealPrice),
					customerName : customerName,
					customerAddress : cartData.customerAddress,
					customerEmail : customerEmail,
					customerPhone : customerPhoneNUmber,
					products : [
						{
							id: menuDataA._id,
							name: menuDataA.name,
							quantity: cartData.quantity,
							priceEachItem : menuDataA.priceEachItem,
							dealPrice : menuDataA.dealPrice,
							farmerId : menuDataA.farmerId,
							imageName : menuDataA.imageName,
							stockType : menuDataA.stockType,
							remainingQuantity : menuDataA.remainingQuantity
						}
					]
				}

				let saveCart = new CartModel(cart);
				saveCart.save(function(err, data){
					if(err){
						console.log("dberror addToCart", err);
						callback("Internal server error");
					} else {
						console.log(data,"after save")
						cartCount = data.products.length;
						callback();
					}
				})
			} else {
				userCart.products.push({
					id: menuDataA._id,
					name: menuDataA.name,
					quantity: cartData.quantity,
					priceEachItem : menuDataA.priceEachItem,
					dealPrice : menuDataA.dealPrice,
					farmerId : menuDataA.farmerId,
					imageName : menuDataA.imageName,
					stockType : menuDataA.stockType,
					remainingQuantity : menuDataA.remainingQuantity

				});
				userCart.orderNetAmount += parseInt(cartData.quantity) * parseFloat(menuDataA.dealPrice);
				CartModel.update({ _id: cartId }, { $set: userCart}, function(err, data){
					if(err){
						console.log("dberror addToCart", err);
						callback("Internal server error");
					} else {
						console.log(data,"data");	
						cartCount += 1;	
						callback();
					}
				})
			}
			
		}
		], function(err){
			if(err){
				res.json({code:400, message: err});
			} else {
				res.json({code:200, message:"Item added to cart" , data:{count: cartCount}});
			}
		})
}

exports.getCustomerCart = function(req, res) {
    if (!common.isValid(req.user) && !common.isValid(req.user.id)) {
        res.json({
            code: 400,
            message: "User not loggedin"
        });
        return;
    }

    let id = req.user.id;
    CartModel.findOne({
            customerId: id
        })
        .select({
            '_id': 1,
            'products': 1

        })
        .exec(function(err, cartData) {
            if (err) {
                console.log("dberror getCustomerCart", err);
                res.json({
                    code: 400,
                    message: "Internal server error"
                });
            } else {
            	if(common.isValid(cartData) && lodash.isEmpty(cartData) == false){
            		let cartCount = cartData.products.length;
            		let cartId = cartData._id;
            		res.json({
            			code:200,
            			data: {id: cartId, cartCount: cartCount},
            			message: "User has a cart"
            		})
            	} else {
            		res.json({
	                    code: 400,
	                    message: "User has empty cart"
	                });
            	}
                
            }
        })
}

exports.getCart = function(req, res){
	let cartId = req.params.id;
	if(!common.isValid(cartId)){
		res.json({code:400, message:"Parameters missing"});
		return;
	}
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code:400, message:"Please login to complete this action"});
		return;
	}

	CartModel.findOne({_id: cartId}, function(err, cartData){
		if(err){
			console.log("dberror getCart", err);
            res.json({
                code: 400,
                message: "Internal server error"
            });
		} else {
			if(common.isValid(cartData) && lodash.isEmpty(cartData) == false){
				res.json({
					code: 200,
                	message: "Success",
                	data : cartData
				})
			} else {
				res.json({
	                code: 400,
	                message: "Your cart is empty"
	            });
			}
		}
	})

}

exports.updateCart = function(req, res){
	let type = req.body.type;
	let cartId = req.body.cartId;
	let itemId = req.body.itemId;
	let quantity = (req.body.quantity < 0 || req.body.quantity == null) ? 1 : req.body.quantity ;
	let userCart = {};
	let menuDataA = {};
	if(!common.isValid(type) || !common.isValid(cartId) || !common.isValid(itemId) || !common.isValid(quantity)){
		res.json({code:400, message: "Parameters missing"});
		return;
	}
	async.series([
		
		function(callback){
			MenuModel.findOne({_id: mongoose.Types.ObjectId(itemId), status: true, isDeleted: false}, function(err, menuData){
				if(err){
					console.log("dberror updateCart", err);
					callback("Internal server error");
				} else {
					if(common.isValid(menuData) && lodash.isEmpty(menuData) == false){
						menuDataA = menuData;
						callback();
					} else {
						callback("This product is not available, please try after sometime");
					}
				}
			})
		},
		function(callback){
			CartModel.findOne({_id: mongoose.Types.ObjectId(cartId)}, function(err, cdata){
				if(err){
					console.log("dberror updateCart", err);
					callback("Internal server error");
				} else {
					if(common.isValid(cdata) && lodash.isEmpty(cdata) == false){
						userCart = cdata;
						callback()	
					} else {
						callback("Invalid cart");
					}
				}
			})
		},
		function(callback) {
			if(quantity > menuDataA.remainingQuantity){
				callback("You can order only" + menuDataA.remainingQuantity + menuDataA.stockType);
			} else {
				callback();
			}
		}, 
		function(callback){
				let index = lodash.findIndex(userCart.products, {id: menuDataA._id});
				if(type == 'quantityUpdate'){
					userCart.products[index].quantity = quantity;
					userCart.products[index].remainingQuantity = menuDataA.remainingQuantity - quantity;
				}

				if(type == 'delete'){
					lodash.pullAt(userCart.products, index);
				}

				
				let netAmount = lodash.sumBy(userCart.products, function(o) { return parseInt(o.quantity) * parseFloat(o.dealPrice) });

				userCart.orderNetAmount = netAmount;
				CartModel.update({ _id: cartId }, { $set: userCart}, function(err, data){
					if(err){
						console.log("dberror updateCart", err);
						callback("Internal server error");
					} else {
						console.log(data,"data");	
						callback();
					}
				})
			}
		], function(err){
			if(err){
				res.json({code:400, message: err});
			} else {
				res.json({code:200, message:"Cart Updated successfully"});
			}
		})

}

exports.clearCart = function(req, res){
	let cartId = req.params.id;
	if(!common.isValid(cartId)){
		res.json({code:400, message: "Parameters missing"});
		return;
	}

	CartModel.remove({_id: cartId}, function(err, data){
		if(err){
			console.log("dberror clearCart", err);
            res.json({
              code: 400,
              message: "Internal serever error"
            })
		} else {
            res.json({
              code: 200,
              message: "Your cart deleted successfully"
            })
		}
	})
}

exports.getProductCategories = function(req, res) {
	CategoryModel.find({status: true, isDeleted: false}, function(err, data){
		if(err){
			console.log("dberror getProductCategories", err);
            res.json({
              code: 400,
              message: "Internal serever error"
            })
		} else {
			let imageUrl = common.default_set.S3_ENDPOINT+ common.default_set.DEALSTICK_CATEGORY_BUCKET;
			res.json({
              code: 200,
              message: "Success",
              data: {data: data, imageUrl : imageUrl}
            })
		}
	})
}

exports.getCategoryProducts = function(req, res) {
	let menuData = [];
	let catName = req.params.catName;
	let type = req.params.type;
	let model = "";
	if(!common.isValid(catName) || !common.isValid(type)){
		res.json({code: 400, message: "Parameters missing"});
		return;
	}

	if(catName == 'Agriculture'){
		model = db.MenuModel();
	}

    model.find({
        categoryName: catName,
        type: type,
        status: true,
        isDeleted: false
    }, {
    	_id : 1 , name : 1, type: 1, categoryName: 1, imageName: 1, priceEachItem: 1, dealPrice: 1, stockType: 1, brand: 1,  farmerName: 1, farmerId: 1, isOrganic : 1
    }, function(err, data) {
    	if(err){
    		console.log("dberror getNewProducts", err);
			res.json({code:400, message:"Internal server error"});
    	} else {
    		if(common.isValid(data) && data.length){
				menuData = data;
				data.imageUrl = data.imageUrl = common.default_set.S3_ENDPOINT+ common.default_set.AGRI_PROD_BUCKET;
				res.json({code:200, message:"Product fetched successfully" , data:data});
			} else {
				res.json({code:400, message:"No Products, we are adding more products for you"});
			}
    	}
    })

 //    MenuModel.aggregate([
	// {
	//   $unwind: "$categoryId"
	// },
 //    {
 //        $lookup: {
 //            from: "categorys",
 //            localField: "categoryId",
 //            foreignField: "_id",
 //            as: "product_docs"
 //        }
 //    },
 //    { $match: {'categoryId' : mongoose.Types.ObjectId(catId), status: true, isDeleted: false} },
 //    { $sort : {created_at : -1} },
 //    { $project : { _id : 1 , name : 1, categoryName: 1, imageName: 1, priceEachItem: 1, stockType: 1, brand: 1, 'product_docs.type' : 1, farmerName: 1, farmerId: 1} }
 //    ]).exec(function(err, data){
 //    	if(err){
	// 		console.log("dberror getNewProducts", err);
	// 		res.json({code:400, message:"Internal server error"});
	// 	} else {
	// 		if(common.isValid(data) && data.length){
	// 			menuData = data;
	// 			res.json({code:200, message:"Product fetched successfully" , data:data});
	// 		} else {
	// 			res.json({code:400, message:"NO products found"});
	// 		}
	// 	}
 //    })
}

exports.getSubCategories = function(req, res) {
	let categoryId = req.params.id;
	if(!common.isValid(categoryId)){
		res.json({code: 400, message: "Parameters missing"});
		return;
	}
	SubCategoryModel.find({categoryId: categoryId, status: true, isDeleted: false},{name: 1, imageName : 1, description: 1, categoryName: 1}, function(err, data){
		if(err){
			console.log("dberror getSubCategories", err);
			res.json({code: 400, message: "Internal server error"});
		} else {
			if(data.length){
				data.imageUrl =data.imageUrl = common.default_set.S3_ENDPOINT+ common.default_set.DEALSTICK_CATEGORY_BUCKET;
				res.json({code: 200, message: "Sub-Categories fetched", data: data});
			} else {
				res.json({code: 400, message: "No Sub-Categories found"});
			}
		}
	})
}

exports.getRecommondedProducts = function(req, res) {
	let menuData = [];
	let catName = req.params.catName;
	let type = req.params.type;
	let model = "";
	if(!common.isValid(catName) || !common.isValid(type)){
		res.json({code: 400, message: "Parameters missing"});
		return;
	}

	if(catName == 'Agriculture'){
		model = db.MenuModel();
	}

    model.find({
        categoryName: catName,
        type: type,
        status: true,
        isDeleted: false
    }, {
    	_id : 1 , name : 1, type: 1, categoryName: 1, imageName: 1, priceEachItem: 1, dealPrice: 1, stockType: 1, brand: 1,  farmerName: 1, farmerId: 1, isOrganic : 1
    }, {limit: 15}, function(err, data) {
    	if(err){
    		console.log("dberror getNewProducts", err);
			res.json({code:400, message:"Internal server error"});
    	} else {
    		if(common.isValid(data) && data.length){
				menuData = data;
				data.imageUrl = data.imageUrl = common.default_set.S3_ENDPOINT+ common.default_set.AGRI_PROD_BUCKET;
				res.json({code:200, message:"Product fetched successfully" , data:data});
			} else {
				res.json({code:400, message:"No Products, we are adding more products for you"});
			}
    	}
    })
}

exports.submitReview = function(req, res){
	let reviewParam = req.body;
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message: 'You are not authenticate to perform this'});
		return;
	}
	if(!common.isValid(reviewParam.productId)){
		res.json({code: 400, message: 'Parameters missing'});
		return;
	}
	let review = {
		userId : req.user.id,
		productId : reviewParam.productId,
		userName : req.user.fullName,
		productName : reviewParam.productName
	}
	if(common.isValid(reviewParam.rating)){
		review['rating'] = reviewParam.rating;
	}
	if(common.isValid(reviewParam.review)){
		review['review'] = reviewParam.review;
	}
	let reviewData = new ReviewModel(review);
	reviewData.save(function(err, data){
		if(err){
			console.log("dberror submitReview", err);
			res.json({code:400, message:"Internal server error"});
		} else {
			res.json({code:200, message: "Thank you for your response"});
		}
	})
}

exports.systemParams = function(req, res){
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message: 'You are not authorised'});
		return;
	}
	let type = "system_parameters";

	SystemParamsModel.findOne({type: type}, {deliveryPercentage:1, deliveryPrice: 1, gstCharges: 1, minPerchaseAmt: 1},function(err, data){
		if(err){
			console.log("dberror systemParams", err);
			res.json({code:400, message:"Internal server error"});
		} else {
			res.json({code: 200, message: "Data fetched successfully", data: data})
		}
	})
}