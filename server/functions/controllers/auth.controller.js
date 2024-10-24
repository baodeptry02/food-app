const { verifyToken } = require('../services/auth.service');
const { OK, BAD_REQUEST } = require('../config/response.config');
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
    await authService.sendOtpEmail(email);
    return OK(res, 'OTP sent to your email. Please check your inbox.');
  });
  sendVerifyEmail = catchAsync(async (req, res) => {
    const { email } = req.body;

    await authService.sendVerifyEmail(email);
    return OK(
      res,
      'Verification email sent to your email. Please check your inbox.'
    );
  });
  verifyEmail = catchAsync(async (req, res) => {
    const { oobCode } = req.query;

    if (!oobCode) {
      return res
        .status(400)
        .json({ error: 'Invalid request. Missing verification code.' });
    }

    try {
      await admin.auth().applyActionCode(oobCode);
      return res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
      console.error('Error verifying email:', error);
      return res
        .status(400)
        .json({
          error:
            'Failed to verify email. The code may have expired or is invalid.',
        });
    }
  });
}
module.exports = new AuthController();
