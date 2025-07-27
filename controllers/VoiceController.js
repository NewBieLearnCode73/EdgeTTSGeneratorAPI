const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const Voice = require("../models/Voice")
const TTSHistory = require("../models/TTSHistory");
const path = require("path");
const { generateVoice } = require("../services/VoiceService");
const fs = require("fs");
require("dotenv").config();

const VoiceController = {
  // Get all voices list
  allVoice: async (req, res, next) => {
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
  },

  // Generate voice
  genVoice: async (req, res, next) => {
    const { voice_name, text, username } = req.body;

    const voice = await Voice.findOne({ name: voice_name });

    if (!voice) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Voice name does not exist!"));
    }

    const fileName = generateVoice(voice_name, text, username);

    if (!fileName) {
      return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Can't generate voice, please try again!"));
    }

    // Save to voice history gennerated
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
  },

  // Get mp3 voice
  getMp3Voice: async (req, res, next) => {
    try {
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