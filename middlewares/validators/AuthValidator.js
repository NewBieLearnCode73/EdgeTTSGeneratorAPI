const Joi = require("joi");
const HTTP_STATUS_CODE = require("http-status-codes");
const ApiError = require("../../utils/ApiError");

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

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, error.details[0].message));
    }
    next();
  };
};

module.exports = {
  validateRegister: validate(registerSchema),
  validateLogin: validate(loginSchema),
};
