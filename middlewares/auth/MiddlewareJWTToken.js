const ApiError = require("../../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const MiddlewareJWTToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.UNAUTHORIZED, "Missing token from header!"));
  }

  try {
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.UNAUTHORIZED, "Something wrong with your token!"));
      }

      req.user = user;
      next();
    });
  } catch (err) {
    return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.UNAUTHORIZED, "Invalid Token!"));
  }
};
