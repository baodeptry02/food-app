const express = require('express');

const router = express.Router();

const cartController = require('../controllers/cart.controller');
// const CartValidation = require('../validation/cart.validation');
// const validate = require('../middlewares/validate.middleware');

router.post('/:userid/:productId', cartController.addToCart);
router.patch('/:userid/:productId', cartController.addToCart);
router.get('/:userid', cartController.getCartByUser);
router.delete('/:userid/:productId', cartController.removeCartItem);

module.exports = router;
