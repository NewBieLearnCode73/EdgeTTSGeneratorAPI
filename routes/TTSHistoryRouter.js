const express = require("express")
const TTSHistoryRouter = express.Router();

const TTSHistoryController = require("../controllers/TTSHistoryController");
const MiddlewareJWTToken = require("../middlewares/auth/MiddlewareJWTToken");
const MiddlewareRole = require("../middlewares/auth/MiddlewareRole");

TTSHistoryRouter.get("/", MiddlewareJWTToken, MiddlewareRole(["ADMIN"]), TTSHistoryController.getAllHistory);

TTSHistoryRouter.get(
  "/username/:username",
  MiddlewareJWTToken,
  MiddlewareRole(["ADMIN", "USER"]),
  TTSHistoryController.getHistoryByUsername
);
TTSHistoryRouter.get(
  "/filename/:filename",
  MiddlewareJWTToken,
  MiddlewareRole(["ADMIN", "USER"]),
  TTSHistoryController.getHistoryByFilename
);


module.exports = TTSHistoryRouter