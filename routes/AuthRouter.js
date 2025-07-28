const express = require("express")
const AuthController = require("../controllers/AuthController")
const { validateRegister, validateLogin } = require("../middlewares/validators/AuthValidator");

const AuthRouter = express.Router();

AuthRouter.post("/register", validateRegister, AuthController.registerUser);
AuthRouter.post("/login", validateLogin, AuthController.loginUser);
AuthRouter.get("/verify-email", AuthController.verifyEmail);
AuthRouter.get("/reset-password", AuthController.resetPassword);

// ****************************************************************** //
// PLEASE! READ README FILE FOR MORE INFORMATION TO HANDLE THIS ROUTE //
// ****************************************************************** //
AuthRouter.post("/reset-password-with-code", AuthController.resetPasswordWithCode);



module.exports = AuthRouter