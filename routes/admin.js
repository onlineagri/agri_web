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
router.get('/menu', adminController.getMenuList);
router.post('/menu', adminController.addMenu);
router.get('/menu/:id', adminController.getMenuById);
router.put('/menu', adminController.addMenu);
router.delete('/menu/:id', adminController.deleteMenu);


module.exports = router;