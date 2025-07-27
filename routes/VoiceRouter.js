const express = require("express")
const VoiceRouter = express.Router();
const VoiceController = require("../controllers/VoiceController");
const MiddlewareJWTToken = require("../middlewares/auth/MiddlewareJWTToken");
const { validateGenVoice } = require("../middlewares/validators/VoiceValidator");
const Voice = require("../models/Voice");

VoiceRouter.get("/", VoiceController.allVoice);
VoiceRouter.get("/:fileName", VoiceController.getMp3Voice);
VoiceRouter.post("/", validateGenVoice, VoiceController.genVoice);

module.exports = VoiceRouter;