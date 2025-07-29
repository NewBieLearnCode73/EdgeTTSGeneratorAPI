const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const TTSHistory = require("../models/TTSHistory")
const User = require("../models/User");
const fs = require("fs");
require("dotenv").config();

const TTSHistoryController = {
    getAllHistory: async (req, res, next) => {
        const ttsHistory = await TTSHistory.find({})

        if (!ttsHistory) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "No TTS history found"));
        }
        res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
            statusCode: true,
            message: "TTS history retrieved successfully",
            data: ttsHistory
        });
    },

    getHistoryByUsername: async (req, res, next) => {
        const { username } = req.params;

        if (!username) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Username is required"));
        }

        const user = await User.findOne({ username });
        if (!user) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "User not found"));
        }

        const ttsHistory = await TTSHistory.find({ username });

        if (!ttsHistory) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "No TTS history found for this user"));
        }
        res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
            statusCode: true,
            message: "TTS history retrieved successfully",
            data: ttsHistory
        });
    },

    getHistoryByFilename: async (req, res, next) => {
        const { filename } = req.params;

        if (!filename) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Filename is required"));
        }

        const ttsHistory = await TTSHistory.findOne({ filename });

        if (!ttsHistory) {
            return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.NOT_FOUND, "No TTS history found for this filename"));
        }
        res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
            statusCode: true,
            message: "TTS history retrieved successfully",
            data: ttsHistory
        });
    },
}

module.exports = TTSHistoryController;