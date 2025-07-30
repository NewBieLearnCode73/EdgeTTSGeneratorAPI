const express = require("express")
const UserQuotaRouter = express.Router();
const UserQuotaController = require("../controllers/UserQuotaController");
const MiddlewareJWTToken = require("../middlewares/auth/MiddlewareJWTToken");
const MiddlewareRole = require("../middlewares/auth/MiddlewareRole");

UserQuotaRouter.get("/", UserQuotaController.getAllUserQuota);
UserQuotaRouter.get("/today/:username", MiddlewareJWTToken, UserQuotaController.getTodayUserQuota);
UserQuotaRouter.get("/today/reset/:username", MiddlewareJWTToken, MiddlewareRole("ADMIN"), UserQuotaController.resetTodayUserQuota);

module.exports = UserQuotaRouter;