var express = require('express');
var router = express.Router();
var productController = require("../modules/product/productController.js");

/* GET home page. */
router.get('/getnewproducts', productController.getNewProducts);
router.get('/combos', productController.getCombos);
router.get('/combo/:id', productController.getComboDetails);
router.get('/details/:id', productController.productDetails);
router.get('/getmorecombo/:id', productController.getMoreCombos);
router.get('/combo/:pageno/:pagesize', productController.getAllCombos);
router.get('/details/:catid/:id', productController.getProductDetails);
router.get('/moreproducts/:catid/:id', productController.getMoreProducts);
router.post('/allproducts', productController.allProducts)


router.get('/getproduct/:id', productController.getproduct);
router.post('/addtocart', productController.addToCart);
router.get('/cart', productController.getCustomerCart);
router.get('/cart/:id', productController.getCart);
router.put('/cart', productController.updateCart);
router.delete('/cart/:id', productController.clearCart);
router.get('/getproductcategories', productController.getProductCategories);
router.get('/getcategoryproducts/:catName/:type', productController.getCategoryProducts);
router.get('/getsubcategories/:id', productController.getSubCategories);
router.get('/getrecommondedproducts/:catName/:type', productController.getRecommondedProducts);
router.post('/submitreview', productController.submitReview);
router.get('/systemparams', productController.systemParams);




module.exports = router;