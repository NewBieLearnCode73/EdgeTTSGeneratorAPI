const ApiError = require("../utils/ApiError")
const HTTP_STATUS_CODE = require("http-status-codes")

const UrlHandleError = (req, res, next) => {
    next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, `Can't find ${req.originalUrl}!`));
}

module.exports = UrlHandleError