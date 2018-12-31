var express = require('express');
var router = express.Router();
var customerController = require("../modules/customer/customerController.js");

/* GET home page. */
router.get('/customer/:phone', customerController.getUser);
router.post('/customer', customerController.updateProfile);
router.post('/updatepassword', customerController.updatePassword)

module.exports = router;