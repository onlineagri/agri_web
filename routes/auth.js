var express = require('express');
var router = express.Router();
var authenticationController = require("../modules/userAuthentication/authenticationController.js");

/* GET users listing. */
router.post('/login', authenticationController.login);
router.post('/register', authenticationController.userRegister);

module.exports = router;
