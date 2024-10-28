const express = require('express');
const userController = require('../controllers/user.controller');
const authController = require('../controllers/auth.controller');

const router = express.Router();

router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/jwtVerification', authController.jwtVerification);
router.post('/forget-password', userController.sendForgetPassword);
router.post('/send-otp', authController.sendOtpEmail);
router.post('/verify-otp', authController.verifyOtp);
router.post('/send-email-verify', authController.sendVerifyEmail);

module.exports = router;
