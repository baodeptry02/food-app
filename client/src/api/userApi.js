import axios from 'axios';
export const baseURL =
  'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

export const getUserFromFirestore = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/users/${userId}`);
    return res.data.data;
  } catch (err) {
    return err;
  }
};

export const createUser = async (user) => {
  try {
    const res = await axios.post(`${baseURL}/api/users/`, user);
    return res.data.data;
  } catch (err) {
    return err;
  }
};
