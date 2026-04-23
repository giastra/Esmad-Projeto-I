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

const validateColorId = [
  param('id')
    .isMongoId()
    .withMessage('ID inválido'),
  handleValidationErrors
];

const validateCreateColor = [
  body('name')
    .notEmpty().withMessage('O nome é obrigatório')
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('O nome deve ter entre 2 e 50 caracteres'),

  body('hex')
    .notEmpty().withMessage('O valor hex é obrigatório')
    .trim()
    .matches(/^#([0-9A-Fa-f]{6})$/).withMessage('O valor hex deve estar no formato #RRGGBB'),

  handleValidationErrors
];

const validateUpdateColor = [
  param('id')
    .isMongoId().withMessage('ID inválido'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 }).withMessage('O nome deve ter entre 2 e 50 caracteres'),

  body('hex')
    .optional()
    .trim()
    .matches(/^#([0-9A-Fa-f]{6})$/).withMessage('O valor hex deve estar no formato #RRGGBB'),

  handleValidationErrors
];

module.exports = {
  validateCreateColor,
  validateUpdateColor,
  validateColorId
};