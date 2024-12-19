const catchAsync = require('../utils/catchAsync');
const { OK, CREATED } = require('../config/response.config');
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

  getAllProducts = catchAsync(async (req, res) => {
    try {
      const products = await productService.getAllProductsFromFirestore();
      return OK(res, 'Products retrieved successfully', products);
    } catch (error) {
      throw new APIError(500, 'Error retrieving products', error.stack);
    }
  });

  getAddressData = catchAsync(async (req, res) => {
    const { province, district, ward_street } = req.body;
    try {
      const response = await productService.fetchAddressData(
        province,
        district,
        ward_street
      );
      return OK(res, 'Address data retrieved successfully', response);
    } catch (error) {
      throw new APIError(500, 'Error retrieving address data', error.stack);
    }
  });

  getProductById = catchAsync(async (req, res) => {
    const { id } = req.params;
    try {
      const product = await productService.getProductByIdFromFirestore(id);
      return OK(res, 'Product retrieved successfully', product);
    } catch (error) {
      throw new APIError(500, 'Error retrieving product', error.stack);
    }
  });
}

module.exports = new ProductController();
