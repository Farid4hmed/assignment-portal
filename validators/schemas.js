const Joi = require('joi');

exports.registerSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(6).required(),
});

exports.loginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

exports.assignmentSchema = Joi.object({
    task: Joi.string().min(1).required(),
    adminId: Joi.string().hex().length(24).required(),
});