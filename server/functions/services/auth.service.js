const admin = require('../config/firebaseAdmin.config');
const db = admin.firestore();
const crypto = require('crypto');
const transporter = require('../config/nodemailer.config');

class AuthService {
  async verifyToken(token) {
    try {
      const decodedValue = await admin.auth().verifyIdToken(token);
      if (!decodedValue) {
        throw new Error('Unauthorized access');
      }
      return decodedValue;
    } catch (error) {
      throw new Error('Token is invalid or has expired');
    }
  }
  async verifyOtp(email, otp) {
    try {
      const otpDoc = await db.collection('otps').doc(email).get();

      // Check if the OTP document exists
      if (!otpDoc.exists) {
        return {
          success: false,
          message: 'OTP not found for this email.',
          status: 404, // Not found status
        };
      }

      const { otp: storedOtp, otpExpiry } = otpDoc.data();

      // Check if the provided OTP matches the stored OTP
      if (otp !== storedOtp) {
        return {
          success: false,
          message: 'Invalid OTP.',
          status: 400, // Bad request status
        };
      }

      // Check if the OTP has expired
      if (Date.now() > otpExpiry) {
        return {
          success: false,
          message: 'OTP has expired.',
          status: 410, // Gone status
        };
      }

      // If OTP is valid, delete it from the database
      await db.collection('otps').doc(email).delete();
      console.log('OTP verified and deleted for email:', email);
      return {
        success: true,
        message: 'OTP verified successfully.',
        status: 200, // OK status
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'An error occurred while verifying the OTP.',
        status: 500, // Internal server error status
      };
    }
  }

  async sendOtpEmail(email) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000; // OTP hết hạn sau 10 phút

    await db.collection('otps').doc(email).set({
      otp,
      otpExpiry,
    });

    const subject = 'Your OTP Code';
    const html = `
      <html>
      <body>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This OTP is valid for 10 minutes.</p>
        <p>Thanks,<br>The Cursus Backend Team</p>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: 'your-email@gmail.com',
        to: email,
        subject,
        html,
      });
      console.log('OTP sent:', otp);
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw new Error('Failed to send OTP. Please try again.');
    }
  }
}

module.exports = new AuthService();
