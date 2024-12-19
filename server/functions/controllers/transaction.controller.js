const catchAsync = require('../utils/catchAsync');
const { OK, CREATED, BAD_REQUEST } = require('../config/response.config');
const APIError = require('../utils/APIError');
const transactionService = require('../services/transaction.service');

class TransactionController {
  checkTransaction = catchAsync(async (req, res) => {
    try {
      const { orderID } = req.query;

      const transactionExists =
        await transactionService.checkTransaction(orderID);

      if (transactionExists) {
        return OK(res, 'Transaction exists', {
          status: 200,
        });
      } else {
        return;
      }
    } catch (error) {
      throw new APIError(500, 'Error retrieving transaction', error.stack);
    }
  });
}

module.exports = new TransactionController();
