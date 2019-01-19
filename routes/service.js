var express = require('express');
var router = express.Router();
var serviceController = require("../modules/service/serviceController.js");

/* GET home page. */
router.post('/service', serviceController.addService);
router.get('/service', serviceController.getServices);
router.get('/service/:id', serviceController.getService);
router.put('/service', serviceController.updateService);



module.exports = router;