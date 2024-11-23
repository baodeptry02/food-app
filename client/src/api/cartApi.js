import axios from 'axios';
export const baseURL =
  'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

export const addToCart = async (cart, userId, productId) => {
  console.log(productId);
  try {
    const response = await axios.post(
      `${baseURL}/api/cart/${userId}/${productId}`,
      cart
    );
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const getCartByUser = async (userId) => {
  console.log(userId);
  try {
    const response = await axios.get(`${baseURL}/api/cart/${userId}`);
    return response.data.data;
  } catch (error) {
    return error.response.data;
  }
};