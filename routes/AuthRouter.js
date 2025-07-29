const express = require("express")
const AuthController = require("../controllers/AuthController")
const {
  validateRegister,
  validateLogin,
  validateResetPasswordWithCode,
  validateChangePassword,
} = require("../middlewares/validators/AuthValidator");

const AuthRouter = express.Router();

AuthRouter.post("/register", validateRegister, AuthController.registerUser);
AuthRouter.post("/login", validateLogin, AuthController.loginUser);
AuthRouter.patch("/change-password", validateChangePassword, AuthController.changePassword);
AuthRouter.get("/verify-email", AuthController.verifyEmail);

// ****************************************************************** //
// PLEASE! READ README FILE FOR MORE INFORMATION TO HANDLE THESE ROUTES //
// ****************************************************************** //
AuthRouter.get("/reset-password", AuthController.resetPassword);
AuthRouter.post("/reset-password-with-code", validateResetPasswordWithCode, AuthController.resetPasswordWithCode);



module.exports = AuthRouter