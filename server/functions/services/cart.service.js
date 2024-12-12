const admin = require('../config/firebaseAdmin.config');
const db = admin.firestore();

class CartService {
  async saveCartToFirestore(cart, userId, productId, action) {
    const cartRef = db
      .collection('cartItems')
      .doc(userId)
      .collection('items')
      .doc(productId);

    const itemSnapshot = await cartRef.get();

    if (itemSnapshot.exists) {
      const existingData = itemSnapshot.data();
      let newQuantity =
        action === 'increment'
          ? existingData.quantity + 1
          : existingData.quantity - 1;
      if (action === 'decrement' && existingData.quantity <= 1) {
        await cartRef.delete();
      } else {
        await cartRef.update({
          quantity: newQuantity,
        });
      }

      if (newQuantity <= 0) {
        await cartRef.delete();
      } else {
        await cartRef.update({
          quantity: newQuantity,
        });
      }
    } else if (action === 'increment') {
      await cartRef.set({
        ...cart,
        quantity: 1,
      });
    }
  }

  async removeCartItemFromFirestore(userId, productId) {
    await db
      .collection('cartItems')
      .doc(userId)
      .collection('items')
      .doc(productId)
      .delete();
  }

  async getAllCartsFromFirestore(userId) {
    const carts = [];
    const querySnapshot = await db
      .collection('cartItems')
      .doc(userId)
      .collection('items')
      .get();
    querySnapshot.docs.forEach((doc) => {
      carts.push(doc.data());
    });
    return carts;
  }
}

module.exports = new CartService();
