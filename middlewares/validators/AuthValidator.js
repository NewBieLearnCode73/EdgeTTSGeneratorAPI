const Joi = require("joi");
const ValidateFunc = require("./ValidateFunc");

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(20).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .pattern(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .required(),
});

const loginSchema = Joi.object({
  username: Joi.string().alphanum().min(6).max(20).required(),
  password: Joi.string().min(6).required(),
});

const resetPasswordWithCodeSchema = Joi.object({
  newPassword: Joi.string().min(6).required(),
});

const changePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

module.exports = {
  validateRegister: ValidateFunc(registerSchema),
  validateLogin: ValidateFunc(loginSchema),
  validateResetPasswordWithCode: ValidateFunc(resetPasswordWithCodeSchema),
  validateChangePassword: ValidateFunc(changePasswordSchema),
};