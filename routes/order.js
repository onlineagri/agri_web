var express = require('express');
var router = express.Router();
var orderController = require("../modules/order/orderController.js");

/* GET home page. */
router.post('/placeorder', orderController.placeOrder);
router.get('/getorder/:id', orderController.getOrder);
router.get('/getorders', orderController.getOrders);
module.exports = router;