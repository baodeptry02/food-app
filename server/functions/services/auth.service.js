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

      if (!otpDoc.exists) {
        return {
          success: false,
          message: 'OTP not found for this email.',
          status: 404,
        };
      }

      const { otp: storedOtp, otpExpiry } = otpDoc.data();

      if (otp !== storedOtp) {
        return {
          success: false,
          message: 'Invalid OTP.',
          status: 400,
        };
      }

      if (Date.now() > otpExpiry) {
        return {
          success: false,
          message: 'OTP has expired.',
          status: 410,
        };
      }

      await db.collection('otps').doc(email).delete();
      console.log('OTP verified and deleted for email:', email);
      return {
        success: true,
        message: 'OTP verified successfully.',
        status: 200,
      };
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'An error occurred while verifying the OTP.',
        status: 500,
      };
    }
  }

  async sendOtpEmail(email) {
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 10 * 60 * 1000;

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
  async sendVerifyEmail(email) {
    const auth = admin.auth();
    console.log(email);

    const link = await auth.generateEmailVerificationLink(email);
    console.log('Original link:', link);

    // Parse the original link
    const url = new URL(link);
    const oobCode = url.searchParams.get('oobCode');
    const apiKey = url.searchParams.get('apiKey');
    const lang = url.searchParams.get('lang');

    const newLink = `https://duybao-cook.vercel.app/verify-email?oobCode=${oobCode}&apiKey=${apiKey}&lang=${lang}`;
    console.log('New link:', newLink);
    const subject = 'Verify Your Email';
    const html = `
      <html>
      <body>
        <p>Click the link below to verify your email:</p>
        <a href="${newLink}">Verify Email</a>
        <p>Thanks,<br>The Cursus Backend Team</p>
      </body>
      </html>
    `;

    try {
      await transporter.sendMail({
        from: 'Food App',
        to: email,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new Error('Failed to send verification email. Please try again.');
    }
  }
}

module.exports = new AuthService();
