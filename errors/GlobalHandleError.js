const ApiError = require("../utils/ApiError")

const GlobalHandleError = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      status_code: err.statusCode,
      message: err.message,
    });
  }

  if (err instanceof Error) {
    return res.status(500).json({
      status_code: 500,
      message: err.message || "Internal Server Error",
    });
  }

  return res.status(500).json({
    status_code: 500,
    message: "Unknown error occurred",
  });
};

module.exports = GlobalHandleError;