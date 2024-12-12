import axios from 'axios';
export const baseURL =
  'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

export const checkTransaction = async (orderID) => {
  try {
    const res = await axios.get(`${baseURL}/api/transaction/`, {
      params: {
        orderID,
      },
    });
    return res.data.data;
  } catch (err) {
    return err;
  }
};
