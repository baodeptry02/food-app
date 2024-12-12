const express = require('express');
const zalopayController = require('../controllers/zalopay.controller');
const router = express.Router();

router.post('/zalopay', zalopayController.payment);

router.post('/callback', zalopayController.callback);

router.post('/order-status/:app_trans_id', zalopayController.orderStatus);

module.exports = router;
