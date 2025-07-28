const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const { sendResetPasswordEmail, sendVerificationEmail } = require("../utils/BrevoUtils");
const { GenerateResetPasswordEmail, GeneratedVerifyAccountEmail } = require("../utils/GenerateAccountEmail");
require("dotenv").config();

const AuthController = {
  // Register
  registerUser: async (req, res, next) => {
    try {
      const { username, password, email } = req.body;

      const existedEmail = await User.findOne({ email });
      const existedUsername = await User.findOne({ username });

      if (existedEmail) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Email already exists!"));
      }

      if (existedUsername) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Username already exists!"));
      }

      const salt = await bcrypt.genSalt(10);
      const pass_hashed = await bcrypt.hash(password, salt);

      const newUser = new User({
        username,
        password: pass_hashed,
        email,
      });

      // Store user data in MongoDB
      const savedUser = await newUser.save();

      // Send verification email
      const verificationLink = GeneratedVerifyAccountEmail(email, savedUser.codeVerification);

      await sendVerificationEmail(email, verificationLink);

      return res.status(HTTP_STATUS_CODE.StatusCodes.CREATED).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.CREATED,
        message: `Create user with username ${savedUser.username} successfully!`,
        data: {
          userId: savedUser._id,
          username: savedUser.username,
          email: savedUser.email,
        },
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Login
  loginUser: async (req, res, next) => {
    try {
      const { username, password } = req.body;

      const existedUser = await User.findOne({ username });

      if (!existedUser) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Username is not found!"));
      }

      const isPasswordValid = await bcrypt.compare(password, existedUser.password);

      if (!isPasswordValid) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Password is not valid!"));
      }

      const payload = {
        id: existedUser._id,
        username: existedUser.username,
        email: existedUser.email,
        role: existedUser.role,
      };

      const accessToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "1d" });
      const refreshToken = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "7d" });

      return res.status(HTTP_STATUS_CODE.StatusCodes.ACCEPTED).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.ACCEPTED,
        message: "Login successfully!",
        data: {
          accessToken,
          refreshToken,
        },
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Verify email
  verifyEmail: async (req, res, next) => {
    try {
      const { code, email } = req.query;

      if (!code || !email) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Code and email are required!"));
      }

      const user = await User.findOne({ email, codeVerification: code });

      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found or code is invalid!"));
      }

      user.isEmailVerified = true;
      user.codeVerification = null;
      await user.save();

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Email verified successfully!",
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Reset password
  resetPassword: async (req, res, next) => {
    try {
      const { email } = req.query;

      if (!email) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Email is required!"));
      }

      const user = await User.findOne({ email: email, isEmailVerified: true });
      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found or email is not verified!"));
      }

      user.codeVerification = uuid.v4();
      await user.save();

      // **************************************** //
      // YOU MUST CHANGE THIS METHOD TO YOUR FRONTEND URL //
      // **************************************** //
      const resetLink = GenerateResetPasswordEmail(user.email, user.codeVerification);

      await sendResetPasswordEmail(user.email, resetLink);

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Reset password email sent successfully!",
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Reset password with code
  resetPasswordWithCode: async (req, res, next) => {
    try {
      const { code, email } = req.query;

      const { newPassword } = req.body;

      if (!code || !email || !newPassword) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Code, email and new password are required!"));
      }

      const user = await User.findOne({ email, codeVerification: code });

      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found or code is invalid!"));
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      user.codeVerification = null;
      await user.save();

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Password reset successfully!",
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },

  // Change password
  changePassword: async (req, res, next) => {
    try {
      const { oldPassword, newPassword } = req.body;
      const userId = req.user.id;

      const user = await User.findById(userId);
      if (!user) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found!"));
      }
      const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
      if (!isPasswordValid) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Old password is not valid!"));
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();
      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Password changed successfully!",
      });
    } catch (err) {
      next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, err.message));
    }
  },
};

module.exports = AuthController;