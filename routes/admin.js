var express = require('express');
var router = express.Router();
var adminController = require("../modules/admin/adminController.js");

/* GET home page. */

router.post('/category/add', adminController.addCategory);
router.get('/category', adminController.getCategories);
router.get('/category/:id', adminController.getCategoryById);
router.post('/category/update', adminController.addCategory);
router.delete('/category/delete/:id', adminController.deleteCategory);


module.exports = router;