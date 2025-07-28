const express = require("express")
const AuthController = require("../controllers/AuthController")
const { validateRegister, validateLogin } = require("../middlewares/validators/AuthValidator");
const { Auth } = require("firebase-admin/auth");

const AuthRouter = express.Router();

AuthRouter.post("/register", validateRegister, AuthController.registerUser);
AuthRouter.post("/login", validateLogin, AuthController.loginUser);
AuthRouter.patch("/change-password", AuthController.changePassword);
AuthRouter.get("/verify-email", AuthController.verifyEmail);

// ****************************************************************** //
// PLEASE! READ README FILE FOR MORE INFORMATION TO HANDLE THESE ROUTES //
// ****************************************************************** //
AuthRouter.get("/reset-password", AuthController.resetPassword);
AuthRouter.post("/reset-password-with-code", AuthController.resetPasswordWithCode);



module.exports = AuthRouter