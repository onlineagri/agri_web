var express = require('express');
var router = express.Router();
var cmsController = require("../modules/cms/cmsController.js");

/* GET home page. */
router.get('/getcms/:cmsfor', cmsController.getCms);
router.post('/marketingcontent', cmsController.marketingContent);


module.exports = router;