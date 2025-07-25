const express = require("express")
const AuthController = require("../controllers/AuthController")
const { validateRegister, validateLogin } = require("../middlewares/validators/AuthValidator");

const AuthRouter = express.Router();

AuthRouter.post("/register", validateRegister, AuthController.registerUser);
AuthRouter.post("/login", validateLogin, AuthController.loginUser);

module.exports = AuthRouter