const catchAsync = require('../utils/catchAsync');
const { OK, CREATED, NOT_FOUND } = require('../config/response.config');
const APIError = require('../utils/APIError');
const orderService = require('../services/order.service');

class OrderController {
  createOrder = catchAsync(async (req, res) => {
    const {
      orderId,
      userId,
      timeExpired,
      totalCartPrice,
      fullAddress,
      selectedProducts,
    } = req.body;

    try {
      const order = await orderService.saveOrderToFirestore(
        orderId,
        userId,
        timeExpired,
        totalCartPrice,
        fullAddress,
        selectedProducts
      );
      return CREATED(res, 'Order created successfully', order);
    } catch (error) {
      throw new APIError(500, 'Error creating order', error.stack);
    }
  });
  updateOrder = catchAsync(async (req, res) => {
    const { userId, orderId } = req.params;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return BAD_REQUEST(res, 'Invalid or missing userId');
    }

    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return BAD_REQUEST(res, 'Invalid or missing orderId');
    }

    try {
      const order = await orderService.updateOrderStatus(userId, orderId);
      return OK(res, 'Order updated successfully', order);
    } catch (error) {
      throw new APIError(500, 'Error updating order', error.stack);
    }
  });
  getOrder = catchAsync(async (req, res) => {
    const { userId, orderId } = req.params;

    if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
      return BAD_REQUEST(res, 'Invalid or missing orderId');
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return BAD_REQUEST(res, 'Invalid or missing userId');
    }

    try {
      const order = await orderService.getOrderFromFirestore(userId, orderId);
      return OK(res, 'Order retrieved successfully', order);
    } catch (error) {
      return NOT_FOUND(res, 'Error retrieving order');
    }
  });
}

module.exports = new OrderController();
