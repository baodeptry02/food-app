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
    const otpExpiryWithTimezone = otpExpiry + 7 * 60 * 60 * 1000;
    const otpExpiryDate = new Date(otpExpiryWithTimezone).toLocaleTimeString();
    await db.collection('otps').doc(email).set({
      otp,
      otpExpiry,
    });

    const subject = 'Your OTP Code';
    const html = `
    <body style="margin: 0; font-family: 'Poppins', sans-serif; background: #ffffff; font-size: 14px;">
      <div style="max-width: 680px; margin: 0 auto; padding: 45px 30px 60px; background: #f4f7ff; border-radius: 10px; color: #434343;">
        <header style="text-align: center;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%;min-width:auto!important;">
    <tr>
      <td align="center" style="padding:0;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:auto;">
          <tr>
            <td align="center" style="padding:0;">
              <a href="https://duybao-cook.vercel.app/" style="background:url(https://duybao-cook.vercel.app/static/media/logo.0f99324454e3c3ccba98.png) no-repeat center center;background-size:32px;color:#2199e8;display:block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;height:50px;line-height:1.3;width:40px;padding:0;text-align:left;text-decoration:none" target="_blank" data-saferedirecturl=""></a>
            </td>
            <td align="center" style="padding:0 10px;">
              <strong style="font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:800;">City</strong>
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:0;">
        <p style="font-size: 16px; color: #555;">${new Date().toLocaleDateString()}</p>
      </td>
    </tr>
  </table>
</header>

        <main>
          <h1 style="text-align: center; font-size: 24px; color: #1f1f1f;">Your OTP</h1>
          <p style="text-align: center; font-weight: 500;">Dear user,</p>
          <p style="text-align: center; margin-top: 10px;">
            Thank you for choosing our service. Use the following OTP to verify your email address:
          </p>
          <h2 style="text-align: center; font-size: 40px; font-weight: 600; color: #ba3d4f;">${otp}</h2>
          <p style="text-align: center; font-weight: 500;">
            Your OTP will be expired at <strong>${otpExpiryDate}</strong>. <span>It's only valid for 10 minutes!</span> Do not share this code with anyone, including our staff.
          </p>
        </main>

        <footer style="text-align: center; margin-top: 30px; border-top: 1px solid #e6ebf1; padding-top: 20px;">
          <p style="color: #8c8c8c;">Need help? Contact us at <a href="mailto:abcxyz@example.com" style="color: #499fb6;">your-email@example.com</a></p>
          <p style="margin-top: 10px;">Copyright © 2024 LMS_BACKEND. All rights reserved.</p>
        </footer>
      </div>
    </body>
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
    const url = new URL(link);

    const date = new Date().toDateString();

    const oobCode = url.searchParams.get('oobCode');
    const apiKey = url.searchParams.get('apiKey');
    const lang = url.searchParams.get('lang');

    const newUrl = `https://lms-backend-1d9f5.firebaseapp.com/__/auth/action?mode=verifyEmail&oobCode=${oobCode}&apiKey=${apiKey}&lang=${lang}`;
    const encodedUrl = encodeURIComponent(newUrl);

    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15); // Generate a random string

    const saferedirectUrlVerifyEmail = `https://www.google.com/url?q=${encodedUrl}&source=gmail&ust=${timestamp}&usg=${randomString}`;

    console.log(newUrl);
    const subject = 'Verify Your Email';
    const html = `
      <html>
      <body>
        <div class=""><div class="aHl"></div><div id=":2r1" tabindex="-1"></div><div id=":2qr" class="ii gt" jslog="20277; u014N:xr6bB; 1:WyIjdGhyZWFkLWY6MTczNjc4NDE2MzQ0NDA5Njk0MSJd; 4:WyIjbXNnLWY6MTczNjc4NDE2MzQ0NDA5Njk0MSIsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLG51bGwsbnVsbCxudWxsLDBd"><div id=":2qq" class="a3s aiL "><u></u> 
   <div style="Margin:0;box-sizing:border-box;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;min-width:100%;padding:0;text-align:left;width:100%!important">   
      <span style="color:#f3f3f3;display:none!important;font-size:1px;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden">Welcome to Food App! You have successfully registered.</span>
      <table style="Margin:0;background:#f3f3f3;border-collapse:collapse;border-spacing:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;height:100%;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%">
         <tbody><tr style="padding:0;text-align:left;vertical-align:top">
            <td align="center" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;direction:ltr;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
               <table align="center" style="Margin:0 auto;background:#fefefe;border-collapse:collapse;border-spacing:0;border-top:6px solid #EF4444;margin:30px auto!important;max-width:600px;min-width:auto;padding:0;text-align:inherit;vertical-align:top;width:100%!important">
                  <tbody>
                     <tr style="padding:0;text-align:left;vertical-align:top">
                        <td style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                           
                           <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                              <tbody>
                                 <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0 auto;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:30px;padding-right:30px;padding-top:25px;text-align:left;width:570px">
                                       <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                          <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:100%;min-width:auto!important;">
  <tr>
    <td align="center" style="padding:0;">
      <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="width:auto;">
        <tr>
          <td align="center" style="padding:0;">
            <a href="https://duybao-cook.vercel.app/" style="background:url(https://duybao-cook.vercel.app/static/media/logo.0f99324454e3c3ccba98.png) no-repeat center center;background-size:32px;color:#2199e8;display:block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;height:50px;line-height:1.3;width:40px;padding:0;text-align:left;text-decoration:none" target="_blank" data-saferedirecturl=""></a>
          </td>
          <td align="center" style="padding:0 10px;">
            <strong style="font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:800;">City</strong>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
                                               
                                             </th>
                                          </tr>
                                       </tbody></table>
                                    </th>
                                 </tr>
                              </tbody>
                           </table>
                           <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                              <tbody>
                                 <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0 auto;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:30px;padding-right:30px;padding-top:25px;text-align:left;width:570px">
                                       <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                          <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left"></th>
                                             <td style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;width:100%;word-wrap:break-word">
                                                <h5 style="Margin:0;Margin-bottom:10px;color:inherit;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:10px;font-weight:700;line-height:1.3;margin:0;margin-bottom:2px;padding:0;text-align:left;text-transform:uppercase;word-wrap:normal">DATE</h5>
                                                <span style="color:#757575;font-size:14px;letter-spacing:-.5px">${date}</span>
                                             </td>
                                          </tr>
                                       </tbody></table>
                                    </th>
                                    <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                 </tr>
                              </tbody>
                           </table>
                           
                           <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                              <tbody>
                                 <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0 auto;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:30px;padding-right:30px;text-align:left;width:570px">
                                       <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                          <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0;text-align:left">Hello
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0;text-align:left">Welcome to Food App! You have successfully registered.</p>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:0;padding:0;text-align:left">Before <span class="il">verifying</span> your email, please check your email at Food App:</p>
                                                <div style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0">
                                                  <ol style="list-style:none;display:table;width:100%;margin:0 0 15px">
                                                    <li style="display:table-row">
                                                      <label style="display:table-cell;width:30%">Email</label>
                                                      <span style="display:table-cell;width:70%">: <strong style="color:#222"><a href="mailto:${email}" target="_blank">${email}</a></strong></span>
                                                    </li>
                                                  </ol>
                                                </div>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong style="color:#222">If the above details are correct,</strong> <span class="il">verify</span> your email by tapping the button below.</p>
                                                <table style="Margin:0 0 16px 0;border-collapse:collapse;border-spacing:0;margin:40px auto;padding:0;text-align:left;vertical-align:top;width:auto">
                                                   <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                      <td style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">
                                                         <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                            <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                                               <td style="Margin:0;background:0 0;border:none;border-collapse:collapse!important;color:#fefefe;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word"><a href="" style="Margin:0;background-color:#EF4444;border:2px solid #B91C1C;border-radius:16px;color:#fefefe;display:inline-block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:700;letter-spacing:1px;line-height:1.3;margin:0;padding:8px 16px 8px 16px;text-align:left;text-decoration:none" target="_blank" data-saferedirecturl=""><span class="il">Verify</span> Email</a></td>
                                                            </tr>
                                                         </tbody></table>
                                                      </td>
                                                   </tr>
                                                </tbody></table>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0;text-align:left">Thank you for choosing us. We wish you have a pleasant experience.</p>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:10px;padding:0;text-align:left">If the button doesn't work, click the link below or copy and paste it to your browser.</p>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;line-height:28px;margin:0;margin-bottom:20px;padding:0;text-align:left"><a href="" style="Margin:0;color:#B81c1c;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:underline" target="_blank" data-saferedirecturl=""><strong>${saferedirectUrlVerifyEmail}</strong></a></p>
                                                <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:28px;margin:0;margin-bottom:0;padding:0;text-align:left">Incorrect account details? <strong style="color:#222">Do not <span class="il">verify</span>,</strong> and ignore this email. Please press resend button on our website to receive the new one.</p>
                                             </th>
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                          </tr>
                                       </tbody></table>
                                    </th>
                                 </tr>
                              </tbody>
                           </table>
                           
                           <div style="border-bottom:1px solid #e7e7e7;margin:20px 16px"></div>
                           <table style="border-collapse:collapse;border-spacing:0;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                              <tbody>
                                 <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0 auto;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:0;padding-bottom:16px;padding-left:30px;padding-right:30px;text-align:left;width:570px">
                                       <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                          <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                               <p style="Margin:0;Margin-bottom:10px;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:12px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:left"><strong>This email has been generated automatically, please do not reply.</strong></p>
                                                <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                                   <tbody>
                                                      <tr style="padding:0;text-align:left;vertical-align:top">
                                                         <td height="10pxpx" style="Margin:0;border-collapse:collapse!important;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:10pxpx;font-weight:400;line-height:10pxpx;margin:0;padding:0;text-align:left;vertical-align:top;word-wrap:break-word">&nbsp;</td>
                                                      </tr>
                                                   </tbody>
                                                </table>
                                             </th>
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                          </tr>
                                       </tbody></table>
                                    </th>
                                 </tr>
                              </tbody>
                           </table>
                           <table style="border-collapse:collapse;border-spacing:0;border-top:1px dashed #c3c3c3;display:table;padding:0;text-align:left;vertical-align:top;width:100%">
                              <tbody>
                                 <tr style="padding:0;text-align:left;vertical-align:top">
                                    <th style="Margin:0 auto;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0 auto;padding:30px;padding-bottom:16px;padding-left:30px;padding-right:30px;text-align:center;width:570px">
                                       <table style="border-collapse:collapse;border-spacing:0;padding:0;text-align:left;vertical-align:top;width:100%">
                                          <tbody><tr style="padding:0;text-align:left;vertical-align:top">
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left">
                                                <h3 style="Margin:0;Margin-bottom:10px;color:#7b7b7b;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:11.67px;font-weight:700;line-height:1.3;margin:0;margin-bottom:15px;padding:0;text-align:center;word-wrap:normal">Follow Us On</h3>
                                                <div style="margin-bottom:15px;text-align:center">
                                                   <a href="" style="Margin:0;background:url(https://ci3.googleusercontent.com/meips/ADKq_Napb9pRbqnXYCTRql64Esc9mRHg4VDmS_Z7X2AHNpP9DPA50FF9etUS_4RlVHN3aEI9v7UAwWYCMDOhkZ6SJOLGf9YuRLbbBlzxdjOzhD_SMQ=s0-d-e1-ft#https://d1o6t6wdv45461.cloudfront.net/s4/emails/twitter.png) no-repeat center center;background-color:#bdbdbd!important;border-radius:50%;color:#2199e8;display:inline-block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;height:32.28px;line-height:1.3;margin:0 2px;padding:0;text-align:left;text-decoration:none;width:32.28px" target="_blank" data-saferedirecturl=""></a>
                                                   <a href="" style="Margin:0;background:url(https://ci3.googleusercontent.com/meips/ADKq_NZ0gwUWed5j9YfmQcZVasPXIOORZgl_LbBSqHDYGfO037_2CZlCHGLRJnnFlCJZYi164ufZaXNUlHsjTAJKb0bW-XaqOmTOKjuOFIcGGoyfTIo=s0-d-e1-ft#https://d1o6t6wdv45461.cloudfront.net/s4/emails/facebook.png) no-repeat center center;background-color:#bdbdbd!important;border-radius:50%;color:#3b5998;display:inline-block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:700;height:32.28px;line-height:1.3;margin:0 2px;padding:0;text-align:left;text-decoration:none;width:32.28px" target="_blank" data-saferedirecturl=""></a>
                                                   <a href="" style="Margin:0;background:url(https://ci3.googleusercontent.com/meips/ADKq_NazMSOgL0A8i39_knGne2E_aYpoL0M4asv5xn70TGbJ10NxuwzCc_Ity05TgeP1MFpqYy_6XytqAvdo2TiX-33RxIUhYn7wCOXilKwrYy9lbA8=s0-d-e1-ft#https://d1o6t6wdv45461.cloudfront.net/s4/emails/linkedin.png) no-repeat center center;background-color:#bdbdbd!important;border-radius:50%;color:#2199e8;display:inline-block;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;height:32.28px;line-height:1.3;margin:0 2px;padding:0;text-align:left;text-decoration:none;width:32.28px" target="_blank" data-saferedirecturl=""></a>
                                                  
                                                </div>
                                                <p style="Margin:0;Margin-bottom:10px;color:#7b7b7b;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:10px;font-weight:400;line-height:1.3;margin:0;margin-bottom:10px;padding:0;text-align:center">Have question on your order? Contact Us at :<a href="mailto:aqaq03122003@gmail.com" style="Margin:0;color:#757575;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left;text-decoration:none" target="_blank"><strong style="display:inline-block">aqaq03122003@gmail.com</strong></a></p>
                                             </th>
                                             <th style="Margin:0;color:#0a0a0a;font-family:HelveticaNeue-Light,'Helvetica Neue Light',Helvetica,Arial,sans-serif;font-size:16px;font-weight:400;line-height:1.3;margin:0;padding:0!important;text-align:left;width:0"></th>
                                          </tr>
                                       </tbody></table>
                                    </th>
                                 </tr>
                              </tbody>
                           </table>
                        </td>
                     </tr>
                  </tbody>
               </table>
            </td>
         </tr>
      </tbody></table>
      
      <div style="display:none;white-space:nowrap;font:15px courier;line-height:0">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</div>
   <img width="1px" height="1px" alt="" src="https://ci3.googleusercontent.com/meips/ADKq_NbbSRA82Di0aDAdnpwD05puxoTgRGwAIUF7EMfjOx93aViBTeqdTvxfOuJr0cHqGHlaTAu6PWAbGH8yv_AjQTWgcRrF-R5H3bX-t8XnnArD5yE-0KesQysvv2I-cwi4xWg5ydOVtoN-COpquhrOmFLvyZzOZuYp2nT-nn6FUru7-K_G7aI0KuXO_FH44WZVrybIHd7hGPCYQm5VERO-RGq28sNhbQHhTUS-Ial3pxJQknd2o2Ob2GcYW2aGtLyA0Z7jEQYLuzfidSRVAbTzbZKlHTwhlOlIyYVtXZSdPoj9RF574cxCh1t2Ov0fYhGELyHA-OwT6CmqXGlaJFqkOEk=s0-d-e1-ft#http://email.gojek.com/o/eJwdzkGOwyAMAMDXNDciY0xcDrxlZYNpaZsg0az2-6v2ASNNeXU7zp9e85h9HK78vs-x23Tj77C59IyACBuyBwLCVaOSbVsNwqVJ4AvBbTzsuZaxL_ccWUGDXYOHKOjVGwdOwI2VrtGnZeaqMiB4_Mhd-usrzynl2Y_bJ4KRQ2rJuxqhONpMXDL1jpgaC1YW1qVmblUb0j-mqTnb" class="CToWUd" data-bit="iit"></div><div class="yj6qo"></div><div class="adL">

</div></div></div><div class="WhmR8e" data-hash="0"></div></div>
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
