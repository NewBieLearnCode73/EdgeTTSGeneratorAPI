const express = require("express")
const UserRouter = express.Router();


const UserController = require("../controllers/UserController");

const { validateChangeRole } = require("../middlewares/validators/UserValidator");

UserRouter.get("/", UserController.getAllUser);
UserRouter.get("/profile", UserController.getProfile);
UserRouter.patch("/change-role", validateChangeRole, UserController.changeUserRole);

module.exports = UserRouter;