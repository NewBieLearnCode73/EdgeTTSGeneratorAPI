const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const UserQuotaSchema = require("../models/UserQuota");
const Voice = require("../models/Voice");
const TTSHistory = require("../models/TTSHistory");
const path = require("path");
const { generateVoice } = require("../services/VoiceService");
const fs = require("fs");
require("dotenv").config();

const VoiceController = {
  // Get all voices list
  allVoice: async (req, res, next) => {
    try {
      const voiceList = await Voice.find({});

      if (voiceList.length === 0) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Something was wrong with list of voices!"));
      }

      const voiceListMapped = voiceList.map((voice) => {
        return `${voice.name} - ${voice.gender}`;
      });

      return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Get all voices successfully!",
        data: { voiceListMapped },
      });
    } catch (error) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Error getting voice list"));
    }
  },

  // Generate voice
  genVoice: async (req, res, next) => {
   try {
     const { voice_name, text } = req.body;
     const username = req.user.username; // req.user after JWT verification

     const voice = await Voice.findOne({ name: voice_name });

     if (!voice) {
       return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Voice name does not exist!"));
     }

     // Finding user quota
     const userQuota = await UserQuotaSchema.getOrCreateDailyQuota(username);

     if (!userQuota.canMakeRequest()) {
       return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.LOCKED, "Daily quota exceeded (10 requests/day)"));
     }
     await userQuota.incrementRequest();

     const fileName = await generateVoice(voice_name, text, username);

     if (!fileName) {
       return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Can't generate voice, please try again!"));
     }

     // Save to voice history generated
     const newTTSHistory = await new TTSHistory({
       username: username,
       text: text,
       voice: voice_name,
       fileName: fileName,
     }).save();

     return res.status(HTTP_STATUS_CODE.StatusCodes.CREATED).json({
       statusCode: HTTP_STATUS_CODE.StatusCodes.CREATED,
       message: "Generate voice successfully!",
       data: {
         newTTSHistory,
       },
     });
   } catch (error) {
     console.error("Error in genVoice:", error);
     return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, `Error generating voice: ${error.message}`));
   }
  },

  // Get mp3 voice
  getMp3Voice: async (req, res, next) => {
    try {
      const username = req.username; // Middleware validateGenVoice
      const user = req.user; // MiddlewareJWTToken

      // Check if role is User --> Accept if username == user.username
      if (user.role === "USER" && user.username !== username) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.FORBIDDEN, "You can only access your own voice files"));
      }

      const fileName = req.params.fileName;
      const filePath = path.join(__dirname, "../storage", fileName);

      if (!fs.existsSync(filePath)) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, `Audio with name ${fileName} doesn't exist!`));
      }

      res.setHeader("Content-Type", "audio/mpeg");
      res.sendFile(filePath);
    } catch (error) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Something was wrong!"));
    }
  },
};

module.exports = VoiceController