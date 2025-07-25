const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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

      const savedUser = await newUser.save();

      return res.status(HTTP_STATUS_CODE.StatusCodes.CREATED).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.CREATED,
        message: `Create user with username ${savedUser.username} successfully!`,
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
};

module.exports = AuthController;
