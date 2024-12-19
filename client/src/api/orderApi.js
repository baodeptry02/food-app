import axios from 'axios';
export const baseURL =
  'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

export const createOrder = async (
  orderId,
  userId,
  timeExpired,
  totalCartPrice,
  fullAddress,
  selectedProducts
) => {
  try {
    const res = await axios.post(`${baseURL}/api/order/`, {
      orderId,
      userId,
      timeExpired,
      totalCartPrice,
      fullAddress,
      selectedProducts,
    });
    return res.data.data;
  } catch (err) {
    return err;
  }
};

export const updateOrder = async (userId, orderId) => {
  try {
    await axios.post(`${baseURL}/api/order/${userId}/${orderId}`);
    return;
  } catch (err) {
    return err;
  }
};

export const getOrder = async (userId, orderId) => {
  try {
    const res = await axios.get(`${baseURL}/api/order/${userId}/${orderId}`);
    return res.data.data;
  } catch (err) {
    return err;
  }
};

export const getAllOrders = async (userId) => {
  try {
    const res = await axios.get(`${baseURL}/api/order/${userId}`);
    return res.data.data;
  } catch (err) {
    return err;
  }
};
