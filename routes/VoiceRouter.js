const express = require("express")
const VoiceRouter = express.Router();
const VoiceController = require("../controllers/VoiceController");
const MiddlewareJWTToken = require("../middlewares/auth/MiddlewareJWTToken");
const { validateGenVoice, validateFilename } = require("../middlewares/validators/VoiceValidator");
const MiddlewareRole = require("../middlewares/auth/MiddlewareRole");

VoiceRouter.get("/", VoiceController.allVoice);
VoiceRouter.get("/:fileName", MiddlewareJWTToken, validateFilename, VoiceController.getMp3Voice);
VoiceRouter.post("/", MiddlewareJWTToken, MiddlewareRole(["ADMIN", "USER"]), validateGenVoice, VoiceController.genVoice);

module.exports = VoiceRouter;