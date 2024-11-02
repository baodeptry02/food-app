const admin = require('../config/firebaseAdmin.config');
const db = admin.firestore();

class ProductService {
  async saveProductToFirestore(product) {
    try {
      await db.collection('products').add(product);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = new ProductService();
