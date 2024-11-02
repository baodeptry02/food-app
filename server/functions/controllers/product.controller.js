const catchAsync = require('../utils/catchAsync');
const { OK, CREATED, BAD_REQUEST } = require('../config/response.config');
const APIError = require('../utils/APIError');
const productService = require('../services/product.service');

class ProductController {
  createProduct = catchAsync(async (req, res) => {
    const product = req.body;
    try {
      await productService.saveProductToFirestore(product);
      return CREATED(res, 'Product created successfully', product);
    } catch (error) {
      throw new APIError(500, 'Error creating product', error.stack);
    }
  });
}

module.exports = new ProductController();
