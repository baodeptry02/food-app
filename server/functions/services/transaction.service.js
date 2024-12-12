const axios = require('axios');

class TransactionService {
  async checkTransaction(orderID) {
    try {
      const response = await axios.get(
        `https://my.sepay.vn/userapi/transactions/list`,
        {
          headers: {
            Authorization: `Bearer ${process.env.DB_SEPAY_API_KEY}`,
          },
        }
      );

      const transactions = response.data.transactions;

      const containsPaymentContent = transactions.some((transaction) =>
        transaction.transaction_content.includes(orderID)
      );

      return containsPaymentContent;
    } catch (error) {
      throw new APIError(500, 'Error fetching transaction data', error.message);
    }
  }
}

module.exports = new TransactionService();
