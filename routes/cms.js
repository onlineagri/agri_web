var express = require('express');
var router = express.Router();
var cmsController = require("../modules/cms/cmsController.js");

/* GET home page. */
router.get('/getcms/:cmsfor', cmsController.getCms);
module.exports = router;