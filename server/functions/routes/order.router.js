const express = require('express');

const router = express.Router();

const orderController = require('../controllers/order.controller');

router.post('/', orderController.createOrder);
router.post('/:userId/:orderId', orderController.updateOrder);
router.get('/:userId/:orderId', orderController.getOrder);

module.exports = router;
