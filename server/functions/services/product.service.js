const admin = require('../config/firebaseAdmin.config');
const db = admin.firestore();
const axios = require('axios');

class ProductService {
  async saveProductToFirestore(product) {
    try {
      const productRef = db.collection('products').doc();
      const productId = productRef.id;
      await productRef.set({
        ...product,
        id: productId,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAllProductsFromFirestore() {
    try {
      const products = [];
      const snapshot = await db.collection('products').get();
      snapshot.forEach((doc) => {
        products.push(doc.data());
      });
      return products;
    } catch (error) {
      throw new Error(error);
    }
  }

  async fetchAddressData(province, district, ward_street) {
    console.log(province);
    console.log(district);
    console.log(ward_street);
    try {
      const url = `https://services.giaohangtietkiem.vn/services/address/getAddressLevel4?province=${province}&district=${district}&ward_street=${ward_street}`;
      const response = await axios.get(url, {
        headers: {
          token: '76duRlamPHwHVcouzoetZaFm9vGqQF4RR8mTXq',
        },
      });
      console.log(url);
      return response.data;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getProductByIdFromFirestore(id) {
    try {
      const productRef = db.collection('products').doc(id);
      const product = await productRef.get();
      return product.data();
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new ProductService();
