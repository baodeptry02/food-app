const catchAsync = require('../utils/catchAsync');
const { OK, CREATED } = require('../config/response.config');
const APIError = require('../utils/APIError');
const cartService = require('../services/cart.service');

class CartController {
  addToCart = catchAsync(async (req, res) => {
    const userId = req.params.userid;
    const productId = req.params.productId;
    const { action, cart } = req.body;

    if (!['increment', 'decrement'].includes(action)) {
      throw new APIError(400, 'Invalid action type.');
    }

    try {
      await cartService.saveCartToFirestore(cart, userId, productId, action);
      return CREATED(res, 'Cart updated successfully', cart);
    } catch (error) {
      throw new APIError(500, 'Error updating cart', error.stack);
    }
  });

  removeCartItem = catchAsync(async (req, res) => {
    const userId = req.params.userid;
    const productId = req.params.productId;
    try {
      await cartService.removeCartItemFromFirestore(userId, productId);
      return OK(res, 'Cart item removed successfully');
    } catch (error) {
      throw new APIError(500, 'Error removing cart item', error.stack);
    }
  });

  getCartByUser = catchAsync(async (req, res) => {
    const userId = req.params.userid;
    try {
      const carts = await cartService.getAllCartsFromFirestore(userId);
      return OK(res, 'Carts retrieved successfully', carts);
    } catch (error) {
      throw new APIError(500, 'Error retrieving carts', error.stack);
    }
  });
}

module.exports = new CartController();
