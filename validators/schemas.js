const Joi = require('joi');

// Updated registerSchema to allow underscores in username
exports.registerSchema = Joi.object({
  username: Joi.string()
    .pattern(/^[a-zA-Z0-9_]+$/) // Allows alphanumeric characters and underscores
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().min(6).required(),
});

exports.loginSchema = Joi.object({
  username: Joi.string().pattern(/^[a-zA-Z0-9_]+$/).required(), // Same pattern applied here
  password: Joi.string().required(),
});

exports.assignmentSchema = Joi.object({
  task: Joi.string().min(1).required(),
  adminId: Joi.string().hex().length(24).required(),
});