const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");
const Voice = require("../models/Voice")
require("dotenv").config()

const VoiceController = {
  // Get all voices
  allVoice: async (req, res, next) => {
    const voiceList = await Voice.find({})

    if (!voiceList) {
        return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.INTERNAL_SERVER_ERROR, "Something was wrong with list of voices!"))
    }

    const voiceListMapped = voiceList.map((voice) => {
        return `${voice.name} - ${voice.gender}`
    })


    return res.status(HTTP_STATUS_CODE.StatusCodes.OK).json({
        statusCode: HTTP_STATUS_CODE.StatusCodes.OK,
        message: "Get all voices successfully!",
        data: {voiceListMapped}
    })
  }
};

module.exports = VoiceController