var express = require('express');
var router = express.Router();
var adminController = require("../modules/admin/adminController.js");

/* GET home page. */

router.post('/category', adminController.addCategory);
router.get('/category', adminController.getCategories);
router.get('/category/:id', adminController.getCategoryById);
router.put('/category', adminController.addCategory);
router.delete('/category/:id', adminController.deleteCategory);
router.get('/customer', adminController.getCustomers);
router.post('/customer', adminController.adminAddCustomer);
router.get('/customer/:id', adminController.getCustomer);
router.put('/customer', adminController.adminUpdateCustomer);
router.delete('/customer/:id', adminController.adminDeleteCustomer);


module.exports = router;