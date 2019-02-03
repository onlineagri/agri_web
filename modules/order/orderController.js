var mongoose = require("mongoose");
var db = require("../../db.js");
var CategoryModel = db.CategoryModel();
var UserModel = db.UserModel();
var AgricultureModel = db.AgricultureModel();
var CartModel = db.CartModel();
var OrderModel = db.OrderModel();
var SystemParamsModel = db.SystemParamsModel();
var common = require("../../config/common.js");
var async =require('async');
var lodash = require('lodash');
var moment = require('moment');

var eventEmmiters = require('../../config/eventEmmiters.js');

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
						if(cartData.orderNetAmount <= systemData.deliveryPrice)
							delivery_charge = (systemData.deliveryPercentage == 0) ? 0 : (parseFloat(cartData.orderNetAmount * (systemData.deliveryPercentage/100))).toFixed(2);
						callback();
					} else {
						callback("We are facing system error");
					}
				}
			})
		},
		function(callback){
			if(systemData.minPerchaseAmt > cartData.orderNetAmount ){
				callback("Order total should be greater than Rupees " + systemData.minPerchaseAmt);
			} else {
				callback();
			}
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
			if(!common.isValid(custData.address) && !common.isValid(req.body.deliveryAddress)){
				callback("Enter delivery address OR ,Please update your address in customer profile section");
			} else {
				custData.address = common.isValid(req.body.deliveryAddress) ? req.body.deliveryAddress : custData.address;
				callback();
			}
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
				orderNetAmount : parseFloat(cartData.orderNetAmount),
				gst_tax : parseFloat(gst_tax),
				delivery_charge : parseFloat(delivery_charge),
				delivery_address : custData.address,
				discount : discount,
				products : cartData.products,
				customerName : req.user.fullName,
				customerEmail : custData.email,
				customerPhone : custData.phoneNumber,
				customerId : req.user.id,
				specialRequest : common.isValid(req.body.specialRequest) ? req.body.specialRequest : "No special Request",
				amountPaid : (parseFloat(cartData.orderNetAmount) + parseFloat(gst_tax) + parseFloat(delivery_charge)).toFixed(2)
			}

			orderData['status'] = "Placed";

			let order = new OrderModel(orderData);
			order.save(function(err, data){
				if(err){
					console.log("dberror placeOrder", err);
					callback("Internal server error")
				} else {
					let orderUrl = common.default_set.HOST + "/orderdetails/" + orderNumber;
					orderData['orderUrl']  = orderUrl;
					eventEmmiters.emit('order_status', orderData);
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
				eventEmmiters.emit('order_status_provider', data);
				callback();
			})
		},
		function(callback){
	        async.each(cartData.products, function(item, cb) {
	            AgricultureModel.updateOne({
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
			AgricultureModel.findOne({_id: mongoose.Types.ObjectId(item.id), status: true, isDeleted: false}, function(err, menuData){
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

exports.cancleOrder = function(req, res){
	let orderId = req.params.orderId;
	if(!common.isValid(req.user) || !common.isValid(req.user.id)){
		res.json({code: 400, message:"You are not authorised to perform this action"});
		return;
	}

	if(!common.isValid(orderId)){
		res.json({code: 400, message:"Parameters missing"});
		return;
	}
	let currentDate = moment().format();
	let beforeHour = moment().subtract(1, 'hours').format();
	OrderModel.findOneAndUpdate({$and:[{orderId : orderId }, {created_at:{$lte: currentDate }},{created_at:{$gte: beforeHour}}]}, { $set: { status: 'Cancelled'}}, {new: true}, function (err, data) {
      if (err) {
        console.log("dberror cancleOrder", err);
        res.json({
            code: 400,
            message: 'Internal server error'
        })
      } else{
        if (common.isValid(data)) {
            res.json({
                code: 200,
                message: 'Your order has been cancled successfully',
            });
        } else{
            res.json({
                code: 400,
                message: 'You can cancle your order within 1 hour after order placed'
            });
        }
      }
    });
}

