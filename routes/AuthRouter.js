const express = require("express")
const AuthController = require("../controllers/AuthController")

const AuthRouter = express.Router()

AuthRouter.post("/register", AuthController.registerUser)
AuthRouter.post("/login", AuthController.loginUser)

module.exports = AuthRouter