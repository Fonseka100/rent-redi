const Joi = require('joi');
const ResponseHandler = require('../utils/responseHandler');

const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required'
  }),
  zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).required().messages({
    'string.pattern.base': 'Zip code must be in valid format (e.g., 12345 or 12345-6789)',
    'any.required': 'Zip code is required'
  })
});

const updateUserSchema = Joi.object({
  name: Joi.string().min(2).max(100).optional(),
  zipCode: Joi.string().pattern(/^\d{5}(-\d{4})?$/).optional()
});

const validateSchema = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      const errors = error.details.map(detail => detail.message);
      return ResponseHandler.badRequest(res, 'Validation error', errors);
    }
    next();
  };
};

const validateUser = validateSchema(userSchema);
const validateUpdateUser = validateSchema(updateUserSchema);

module.exports = {
  validateUser,
  validateUpdateUser
}; 