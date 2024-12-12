const Joi = require('joi');

const createProduct = {
  body: Joi.object().keys({
    category: Joi.string().required(),
    imageDownloadUrl: Joi.string().required(),
    itemName: Joi.string().required(),
    price: Joi.number().required(),
  }),
};

module.exports = {
  createProduct,
};
