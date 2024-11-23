import axios from 'axios';
import { toast } from 'react-toastify';

export const baseURL =
  'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

export const validateUserJWTToken = async (token) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/jwtVerification`, {
      headers: { Authorization: 'Bearer ' + token },
    });
    return res.data.data;
  } catch (err) {
    return err;
  }
};

export const sendForgetPassword = async (email) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/forget-password`, {
      email,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/verify-otp`, {
      otp,
      email,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const sendOtpEmail = async (email) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/send-otp`, {
      email,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const sendVerifyEmail = async (email) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/send-email-verify`, {
      email,
    });
    return res.data;
  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      const errorMessage = err.response.data.error;
      if (errorMessage.includes('TOO_MANY_ATTEMPTS_TRY_LATER')) {
        toast.error('Too many requests. Please try again later.');
      }
    } else {
      toast.error('Failed to send verification email. Please try again later.');
    }
    return err;
  }
};
