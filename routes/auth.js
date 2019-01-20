var express = require('express');
var router = express.Router();
var authenticationController = require("../modules/userAuthentication/authenticationController.js");

/* GET users listing. */
router.post('/login', authenticationController.login);
router.post('/register', authenticationController.userRegister);
router.post('/forgotpass', authenticationController.forgotpass);
router.get('/checktoken/:token', authenticationController.checkToken);
router.post('/changepassword', authenticationController.changePassword);
router.post('/sendcontactemail', authenticationController.sendContactEmail);
router.put('/verifyotp', authenticationController.verifyOtp);

module.exports = router;
