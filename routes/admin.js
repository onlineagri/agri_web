var express = require('express');
var router = express.Router();
var adminController = require("../modules/admin/adminController.js");

/* GET home page. */

router.post('/category/add', adminController.addCategory);
router.get('/category', adminController.getCategories);

module.exports = router;