const admin = require('../config/firebaseAdmin.config');
const db = admin.firestore();
const transactionService = require('../services/transaction.service');

class OrderService {
  async saveOrderToFirestore(
    orderId,
    userId,
    timeExpired,
    totalCartPrice,
    fullAddress,
    selectedProducts
  ) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid userId provided');
    }

    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      throw new Error('Invalid orderId provided');
    }

    const ordersRef = db
      .collection('orders')
      .doc(userId)
      .collection('userOrders');
    const orderDoc = ordersRef.doc(orderId);
    await orderDoc.set({
      userId,
      orderId,
      totalCartPrice,
      status: 'PENDING',
      timeExpired,
      createdAt: new Date(),
      deliveryAddress: fullAddress,
      selectedProducts,
    });

    return {
      userId,
      orderId,
      status: 'PENDING',
    };
  }
  async updateOrderStatus(userId, orderId) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid userId provided');
    }

    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      throw new Error('Invalid orderId provided');
    }

    const isPaymentValid = await transactionService.checkTransaction(orderId);

    if (!isPaymentValid) {
      return;
    }

    const orderRef = db
      .collection('orders')
      .doc(userId)
      .collection('userOrders')
      .doc(orderId);

    const orderSnapshot = await orderRef.get();

    if (!orderSnapshot.exists) {
      throw new Error(
        `Order with ID "${orderId}" not found for user "${userId}"`
      );
    }

    await orderRef.update({
      status: 'PAID',
    });

    return true;
  }

  async getAllOrdersFromFirestore(userId) {
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new Error('Invalid userId provided');
    }

    const orders = [];
    const querySnapshot = await db
      .collection('orders')
      .doc(userId)
      .collection('userOrders')
      .get();

    querySnapshot.forEach((doc) => {
      orders.push(doc.data());
    });

    return orders;
  }

  async getOrderFromFirestore(userId, orderId) {
    const orderSnapshot = await db
      .collection('orders')
      .doc(userId)
      .collection('userOrders')
      .doc(orderId)
      .get();
    if (!orderSnapshot.exists) {
      throw new Error(
        `Order with ID "${orderId}" not found for user "${userId}"`
      );
    }
    return orderSnapshot.data();
  }
}

module.exports = new OrderService();
