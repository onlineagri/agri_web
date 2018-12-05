var express = require('express');
var router = express.Router();
var productController = require("../modules/product/productController.js");

/* GET home page. */
router.get('/getnewproducts', productController.getNewProducts);

module.exports = router;