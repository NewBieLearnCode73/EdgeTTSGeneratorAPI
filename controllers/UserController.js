const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");

const UserController = {
  // Basic CRUD operations for User
  getAllUser: async (req, res, next) => {
    try {
      const users = await User.find({}).select("-password -codeVerification -createdAt -updatedAt -__v");
      if (!users || users.length === 0) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "No users found"));
      }

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Get all users successfully!",
        data: users,
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Profile management
  getProfile: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const user = await User.findById(userId).select("-password -codeVerification -createdAt -updatedAt -__v");

      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found"));
      }

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Get profile successfully!",
        data: user,
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Admin operations
  changeUserRole: async (req, res, next) => {
    try {
      const validRoles = ["USER", "ADMIN"];

      const { userId, newRole } = req.body;

      if (!userId || !newRole) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "User ID and new role are required"));
      }

      const user = await User.findById(userId).select("-password -codeVerification -createdAt -updatedAt -__v");
      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found"));
      }

      if (!validRoles.includes(newRole)) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Invalid role specified"));
      }
      if (user.role === newRole) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "User already has this role"));
      }

      user.role = newRole;
      await user.save();

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "User role changed successfully!",
        data: user,
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },
};

module.exports = UserController;