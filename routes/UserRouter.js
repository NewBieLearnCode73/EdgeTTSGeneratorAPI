const express = require("express")
const UserRouter = express.Router();


const UserController = require("../controllers/UserController");

UserRouter.get("/", UserController.getAllUser);
UserRouter.get("/profile", UserController.getProfile);
UserRouter.patch("/change-role", UserController.changeUserRole);

module.exports = UserRouter;