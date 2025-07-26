const express = require("express")
const VoiceRouter = express.Router();
const VoiceController = require("../controllers/VoiceController");

VoiceRouter.get("/", VoiceController.allVoice);

module.exports = VoiceRouter;