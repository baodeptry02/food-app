const { verifyToken } = require('../services/auth.service');
const {
  OK,
  BAD_REQUEST,
  INTERNAL_SERVER_ERROR,
} = require('../config/response.config');
const APIError = require('../utils/APIError');
const catchAsync = require('../utils/catchAsync');
const authService = require('../services/auth.service');
class AuthController {
  jwtVerification = catchAsync(async (req, res) => {
    if (!req.headers.authorization) {
      return BAD_REQUEST(res, 'Token not found!');
    }

    const token = req.headers.authorization.split(' ')[1];
    try {
      const decodedValue = await verifyToken(token);
      return OK(res, 'Token verified successfully', decodedValue);
    } catch (error) {
      throw new APIError(401, 'Token verification failed', error.stack);
    }
  });
  verifyOtp = catchAsync(async (req, res) => {
    const { email, otp } = req.body;

    const result = await authService.verifyOtp(email, otp);

    if (!result.success) {
      return BAD_REQUEST(res, result.message);
    }

    return OK(res, 'OTP verified successfully');
  });

  sendOtpEmail = catchAsync(async (req, res) => {
    const { email } = req.body;
    try {
      await authService.sendOtpEmail(email);
      return OK(res, 'OTP sent to your email. Please check your inbox.');
    } catch (error) {
      console.error('Error sending OTP email:', error);
      if (error.code === 'auth/too-many-requests') {
        return BAD_REQUEST(res, 'Too many requests. Please try again later.');
      }
      return INTERNAL_SERVER_ERROR(res, 'Failed to send OTP email.');
    }
  });

  sendVerifyEmail = catchAsync(async (req, res) => {
    const { email } = req.body;
    try {
      await authService.sendVerifyEmail(email);
      return OK(
        res,
        'Verification email sent to your email. Please check your inbox.'
      );
    } catch (error) {
      console.error('Error sending verification email:', error);
      if (error.code === 'auth/too-many-requests') {
        return BAD_REQUEST(res, 'Too many requests. Please try again later.');
      }
      return INTERNAL_SERVER_ERROR(res, 'Failed to send verification email.');
    }
  });
}
module.exports = new AuthController();
