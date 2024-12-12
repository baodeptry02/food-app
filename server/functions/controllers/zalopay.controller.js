const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const moment = require('moment');
const qs = require('qs');

const config = {
  app_id: '2553',
  key1: 'PcY4iZIKFCIdgZvA6ueMcMHHUbRLYjPL',
  key2: 'kLtgPl8HHhfvMuDHPwKfgfsY4Ydm9eIz',
  endpoint: 'https://sb-openapi.zalopay.vn/v2',
};

class zalopayController {
  payment = catchAsync(async (req, res) => {
    const { totalCartPrice, selectedProductIds, userId } = req.body;

    try {
      const embed_data = {
        redirecturl: 'https://my-food-city.vercel.app',
      };
      const items = [];
      const transID = Math.floor(Math.random() * 1000000);
      const order = {
        app_id: config.app_id,
        app_trans_id: `${moment().format('YYMMDD')}_${transID}`,
        app_user: 'user123',
        app_time: Date.now(),
        item: JSON.stringify(items),
        embed_data: JSON.stringify(embed_data),
        amount: totalCartPrice,
        description: `Foodappe - Payment for the order #${transID}`,
        bank_code: '',
        callback_url:
          'https://3509-116-110-43-219.ngrok-free.app/lms-backend-1d9f5/us-central1/app/api/payment/callback',
      };

      const data =
        config.app_id +
        '|' +
        order.app_trans_id +
        '|' +
        order.app_user +
        '|' +
        order.amount +
        '|' +
        order.app_time +
        '|' +
        order.embed_data +
        '|' +
        order.item;

      order.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

      const result = await axios.post(config.endpoint + '/create', null, {
        params: order,
      });

      res.json({
        result: result.data,
        order,
      });
    } catch (error) {
      console.error('Error processing payment:', error.message);

      if (!res.headersSent) {
        res.status(500).json({ error: 'Failed to process payment.' });
      }
    }
  });
  callback = catchAsync(async (req, res) => {
    let result = {};

    try {
      let dataStr = req.body.data;
      let reqMac = req.body.mac;

      let mac = CryptoJS.HmacSHA256(dataStr, config.key2).toString();
      console.log('mac =', mac);

      if (reqMac !== mac) {
        result.return_code = -1;
        result.return_message = 'mac not equal';
      } else {
        let dataJson = JSON.parse(dataStr, config.key2);
        result.return_code = 1;
        result.return_message = 'success';
        return res.json(result);
      }
    } catch (ex) {
      result.return_code = 0;
      result.return_message = ex.message;
    }

    res.json(result);
  });
  orderStatus = catchAsync(async (req, res) => {
    async (req, res) => {
      const app_trans_id = req.params.app_trans_id;
      try {
        const postData = {
          app_id: config.app_id,
          app_trans_id: req.body.app_trans_id,
        };

        const data =
          postData.app_id + '|' + postData.app_trans_id + '|' + config.key1;
        postData.mac = CryptoJS.HmacSHA256(data, config.key1).toString();

        const postConfig = {
          method: 'post',
          url: config.endpoint + '/query',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          data: qs.stringify(postData),
        };

        const response = await axios(postConfig);
        console.log(JSON.stringify(response.data));
        res.json(response.data);
      } catch (error) {
        console.error('Error in refund:', error.message);
        res.status(500).json({ error: 'Failed to process refund.' });
      }
    };
  });
}

module.exports = new zalopayController();
