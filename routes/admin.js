var express = require('express');
var router = express.Router();
var adminController = require("../modules/admin/adminController.js");

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log(req.user)
  res.json({code: 200, message: "Hey admin welcome"});
});

router.post('/category/add', adminController.addCategory);

module.exports = router;