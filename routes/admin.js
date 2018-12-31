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
router.get('/farmer/list', adminController.getFarmerList);
router.get('/order', adminController.getOrders);
router.get('/order/:id', adminController.getOrder);
router.put('/order', adminController.updateOrderStatus);
router.post('/cms', adminController.addContent);
router.get('/cms', adminController.getContents);
router.get('/cms/:id', adminController.getCmsContent);
router.delete('/cms/:id', adminController.deleteContent);
router.post('/clothingmenu', adminController.addClothingMenu);
router.get('/users', adminController.getUsers);
router.get('/businessperson', adminController.getBusinessPersons);
router.post('/businessperson', adminController.adminAddBusinessPerson);
router.get('/businessperson/:id', adminController.getBusinessPerson);
router.put('/businessperson', adminController.adminUpdateBusinessPerson);
router.delete('/businessperson/:id', adminController.adminDeleteBusinessPerson);
router.post('/subcategory', adminController.addSubCategory);
router.get('/subcategory', adminController.getSubCategories);
router.get('/systemparams', adminController.getDeliveryCharges);
router.put('/systemparams', adminController.updateDeliveryCharges);

module.exports = router;