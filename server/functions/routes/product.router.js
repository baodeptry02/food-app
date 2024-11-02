const express = require('express');

const router = express.Router();
const productController = require('../controllers/product.controller');
const ProductValidation = require('../validation/product.validation');
const validate = require('../middlewares/validate.middleware');

router.post(
  '/',
  validate(ProductValidation.createProduct),
  productController.createProduct
);
// router.get('/', productController.getAllProducts);
// router.get('/:id', productController.getProduct);
// router.put('/:id', productController.updateProduct);
// router.delete('/:id', productController.deleteProduct);

module.exports = router;
