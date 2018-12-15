var express = require('express');
var router = express.Router();
var productController = require("../modules/product/productController.js");

/* GET home page. */
router.get('/getnewproducts', productController.getNewProducts);
router.get('/getproduct/:id', productController.getproduct);
router.post('/addtocart', productController.addToCart);
router.get('/cart', productController.getCustomerCart);
router.get('/cart/:id', productController.getCart);
router.put('/cart', productController.updateCart);
router.delete('/cart/:id', productController.clearCart);
router.get('/getproductcategories', productController.getProductCategories);
router.get('/getcategoryproducts/:id', productController.getCategoryProducts);



module.exports = router;