const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const UserQuotaSchema = require("../models/UserQuota");

const UserQuotaController = {
  // Get all user quota today
  getTodayUserQuota: async (req, res, next) => {
    const username  = req.params.username;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userQuota = await UserQuotaSchema.findOne({ username, date: today });
    if (!userQuota) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User quota not found for today"));
    }

    return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
      statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
      message: "Get today's user quota successfully!",
      data: userQuota,
    });
  },

  // Get all user quota (Admin operation)
  getAllUserQuota: async (req, res, next) => {
    const userQuotas = await UserQuotaSchema.find({});
    return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
      statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
      message: "Get all user quota successfully!",
      data: userQuotas,
    });
  },

  // Reset user today quota (Admin operation)
  resetTodayUserQuota: async (req, res, next) => {
    const  username  = req.params.username;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const userQuota = await UserQuotaSchema.findOne({ username, date: today });

    if (!userQuota) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User quota not found for today"));
    }

    userQuota.resetDailyQuota();

    return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
      statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
      message: "User quota reset successfully!",
      data: userQuota,
    });
  },
};

module.exports = UserQuotaController;