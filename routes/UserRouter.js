const express = require("express")
const UserRouter = express.Router();
const MiddlewareRole = require("../middlewares/auth/MiddlewareRole");
const MiddlewareJWTToken = require("../middlewares/auth/MiddlewareJWTToken");

const UserController = require("../controllers/UserController");

const { validateChangeRole } = require("../middlewares/validators/UserValidator");

UserRouter.get("/", MiddlewareJWTToken, MiddlewareRole(["ADMIN"]), UserController.getAllUser);
UserRouter.get("/profile", MiddlewareJWTToken, UserController.getProfile);
UserRouter.patch("/change-role", MiddlewareJWTToken, MiddlewareRole(["ADMIN"]), validateChangeRole, UserController.changeUserRole);

module.exports = UserRouter;