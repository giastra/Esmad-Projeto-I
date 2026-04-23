const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map(e => e.msg)
    });
  }
  next();
};

const validateRegister = [
  body('name').notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
  handleValidationErrors
];

const validateLogin = [
  body('email').isEmail(),
  body('password').notEmpty(),
  handleValidationErrors
];

const validateUpdateUser = [
  body('name').optional(),
  body('email').optional().isEmail(),
  body('password').optional().isLength({ min: 6 }),
  handleValidationErrors
];

const validateUserId = [
  param('id').isMongoId(),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateUserId
};