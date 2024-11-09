import axios from "axios";
export const baseURL =
  "http://localhost:5001/lms-backend-1d9f5/us-central1/app";

export const createProduct = async (product) => {
  try {
    const res = await axios.post(`${baseURL}/api/product/`, product);
    return res.data.data;
  } catch (err) {
    return null;
  }
};

export const getAllProducts = async () => {
  try {
    const res = await axios.get(`${baseURL}/api/product/`);
    return res.data.data;
  } catch (err) {
    return null;
  }
};
