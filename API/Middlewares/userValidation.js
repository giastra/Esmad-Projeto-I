const { body, param, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Erro de validação',
      errors: errors.array().map(e => e.msg)
    });
  }
  next();
};

const validateRegister = [
  body('name')
    .notEmpty().withMessage('O nome é obrigatório')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('O nome deve ter entre 2 e 50 caracteres'),

  body('email')
    .notEmpty().withMessage('O email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('A password é obrigatória')
    .isLength({ min: 6 }).withMessage('A password deve ter pelo menos 6 caracteres'),

  handleValidationErrors
];

const validateLogin = [
  body('email')
    .notEmpty().withMessage('O email é obrigatório')
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty().withMessage('A password é obrigatória'),

  handleValidationErrors
];

const validateUpdateUser = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('O nome deve ter entre 2 e 50 caracteres'),

  body('email')
    .optional()
    .isEmail().withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('A password deve ter pelo menos 6 caracteres'),

  body('Admin')
    .optional()
    .isBoolean().withMessage('Admin deve ser verdadeiro ou falso'),

  handleValidationErrors
];

const validateUserId = [
  param('id')
    .isMongoId().withMessage('ID inválido'),
  handleValidationErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUpdateUser,
  validateUserId
};