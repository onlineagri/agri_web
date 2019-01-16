var express = require('express');
var router = express.Router();
var marketingController = require("../modules/marketing/marketingController.js");

/* GET home page. */
router.post('/content', marketingController.addContent);
router.get('/content', marketingController.getContents);
router.get('/content/:id', marketingController.getContentbyId);
router.put('/content', marketingController.updateContent);
router.delete('/content/:id', marketingController.deleteContent);
module.exports = router;