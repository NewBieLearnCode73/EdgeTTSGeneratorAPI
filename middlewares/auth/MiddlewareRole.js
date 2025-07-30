const ApiError = require("../../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");

const MiddlewareRole = (role) => {
    return (req, res, next) => {
        if (req.user && role.includes(req.user.role)) {
          next();
        } else {
          return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.FORBIDDEN, "You do not have permission to access this resource!"));
        }
    };
};

module.exports = MiddlewareRole;
