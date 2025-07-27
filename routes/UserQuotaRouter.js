const express = require("express")
const UserQuotaRouter = express.Router();
const UserQuotaController = require("../controllers/UserQuotaController");

UserQuotaRouter.get("/", UserQuotaController.getAllUserQuota);
UserQuotaRouter.get("/today/:username", UserQuotaController.getTodayUserQuota);
UserQuotaRouter.get("/today/reset/:username", UserQuotaController.resetTodayUserQuota);

module.exports = UserQuotaRouter;