var mongoose = require("mongoose");
var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var UserModel = db.UserModel();
var MenuModel = db.MenuModel();
var CartModel = db.CartModel();
var OrderModel = db.OrderModel();
var SystemParamsModel = db.SystemParamsModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');

exports.placeOrder = function(req, res){
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message : "You need to login first"});
		return;
	}

	if(!common.isValid(req.body.cartId)){
		res.json({code: 400, message: "Parameters missing"});
		return;
	}
	let cartId = req.body.cartId;
	let cartData = {};
	let systemData = {};
	let custData = {};
	let gst_tax = 0;
	let delivery_charge = 0;
	let discount = 0;
	let oid;
	async.series([
		function(callback){
			CartModel.findOne({_id: cartId}, function(err, cdata){
				if(err){
					console.log("dberror placeOrder", err);
					callback("Internal Server error");
				} else {
					if(common.isValid(cdata) && lodash.isEmpty(cdata) == false){
						cartData = cdata;
						callback();
					} else {
						callback("Invalid cart");
					}
				}
			})
		}, 
		function(callback){
			SystemParamsModel.findOne({type: "system_parameters"}, function(err, sysData){
				if(err){
					console.log("dberror placeOrder", err);
					callback("Internal Server error");
				} else {
					if(common.isValid(sysData) && lodash.isEmpty(sysData) == false){
						systemData = sysData;
						gst_tax = (systemData.gstCharges <=0) ? 0 : (parseFloat(cartData.orderNetAmount * (systemData.gstCharges/100))).toFixed(2); 
						delivery_charge = (systemData.deliveryCharges == 0) ? 0 : (parseFloat(cartData.orderNetAmount * (systemData.deliveryCharges/100))).toFixed(2);
						callback();
					} else {
						callback("We are facing system error");
					}
				}
			})
		},
		function(callback){
			checkCartValidity(cartData, function(err, succ){
				if(err){
					callback("Some products in cart are not availble right now, please remove them or try after sometime");
				} else {
					callback();
				}
			});
		},
		function(callback) {
			UserModel.findOne({_id: mongoose.Types.ObjectId(req.user.id), status: 'active', isDeleted: false}, function(err, cData){
				if(err){
					console.log("dberror placeOrder", err);
					callback("Internal server error")
				} else {
					if(common.isValid(cData) && lodash.isEmpty(cData) == false){
						custData = cData;
						callback();
					} else {
						callback("You are not authenticated");
					}
				}
			})
		}, 
		function(callback){

			function makeid() {
			  var text = "";
			  var possible = "0123456789";

			  for (var i = 0; i < 5; i++)
			    text += possible.charAt(Math.floor(Math.random() * possible.length));

			  return text;
			}
			let orderNumber = "TAONLINE" + makeid();

			var orderData = {
				orderId : orderNumber,
				orderNetAmount : cartData.orderNetAmount,
				gst_tax : gst_tax,
				delivery_charge : delivery_charge,
				delivery_address : custData.address,
				discount : discount,
				products : cartData.products,
				customerName : req.user.fullName,
				customerEmail : custData.email,
				customerPhone : custData.phoneNumber,
				customerId : req.user.id,
				amountPaid : (parseFloat(cartData.orderNetAmount) + parseFloat(gst_tax) + parseFloat(delivery_charge)).toFixed(2)
			}
			let order = new OrderModel(orderData);
			order.save(function(err, data){
				if(err){
					console.log("dberror placeOrder", err);
					callback("Internal server error")
				} else {
					oid = data._id;
					callback();
				}
			})
		},
		function(callback){
			CartModel.remove({_id: cartId}, function(err, data){
				if(err){
					console.log("dberror placeOrder", err);
				} 
				callback();
			})
		},
		function(callback){
	        async.each(cartData.products, function(item, cb) {
	            MenuModel.update({
	                _id: mongoose.Types.ObjectId(item.id)
	            },{ "$inc": { "remainingQuantity": - item.quantity} }, function(err, menuData) {
	            	if(err){
	            		console.log("dberror placeOrder", err);
	            	}
	            	cb();
	            })
	        },function(err){
	        	callback();
	        })
		}
		], function(err){
			if(err){
				res.json({code: 400, message : err});
			} else{
				res.json({code:200, message:"Order placed successfully", data:{id:oid}})
			}
		})
}

function checkCartValidity(cartData,callback) {
	async.each(cartData.products, function(item, cb){
		if(item.id){
			MenuModel.findOne({_id: mongoose.Types.ObjectId(item.id), status: true, isDeleted: false}, function(err, menuData){
				if(err){
					console.log("dberror placeOrder", err);
					cb();
				} else {
					if(common.isValid(menuData) && lodash.isEmpty(menuData) == false){
						if(item.quantity > menuData.remainingQuantity || menuData.remainingQuantity <=0){
							lodash.remove(cartData.products, {id: item.id});
							let netAmount = lodash.sumBy(cartData.products, function(o) { return parseInt(o.quantity) * parseFloat(o.dealPrice) });

							cartData.orderNetAmount = netAmount;
							CartModel.update({ _id: cartData._id }, { $set: cartData}, function(err, data){
								if(err){
									console.log("dberror updateCart", err);
									cb("Internal server error");
								} else {	
									cb("Some Items may expire");
								}
							})
						} else {
							cb();
						}
					} else {
						lodash.remove(cartData.products, {id: item.id});
						let netAmount = lodash.sumBy(cartData.products, function(o) { return parseInt(o.quantity) * parseFloat(o.dealPrice) });

						cartData.orderNetAmount = netAmount;
						CartModel.update({ _id: cartData._id }, { $set: cartData}, function(err, data){
							if(err){
								console.log("dberror updateCart", err);
								cb("Internal server error");
							} else {	
								cb("Some Items may expire");
							}
						})
					}
				}
			})
		} else {
			cb();
		}
	}, function(err){
		if(err){
			callback(err, null);
		} else {
			callback(null, "This cart is valid");
		}
	})
}

exports.getOrder = function(req, res){
	let orderId = req.params.id;
	if(!common.isValid(orderId)){
		res.json({code:400, message:"Parameters missing"});
		return;
	}

	OrderModel.findOne({_id: mongoose.Types.ObjectId(orderId)}, function(err, orderData){
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

	OrderModel.find({customerId: req.user.id}, function(err, data){
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

