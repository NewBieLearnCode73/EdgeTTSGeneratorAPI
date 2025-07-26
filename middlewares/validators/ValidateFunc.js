const HTTP_STATUS_CODE = require("http-status-codes");
const ApiError = require("../../utils/ApiError");

const ValidateFunc = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, error.details[0].message));
    }
    next();
  };
};

module.exports = ValidateFunc;