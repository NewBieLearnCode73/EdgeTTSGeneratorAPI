const Joi = require("joi")
const ValidateFunc = require("../validators/ValidateFunc")
const HTTP_STATUS_CODE = require("http-status-codes");
const ApiError = require("../../utils/ApiError");

const genVoiceSchema = Joi.object({
  voice_name: Joi.string().required(),
  text: Joi.string().required(),
});

const validateFilename = (req, res, next) => {
  const { fileName } = req.params;

  // Checking format
  if (!fileName || !/^[a-zA-Z0-9_-]+\.mp3$/.test(fileName)) {
    return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Invalid file name format"));
  }

  // Path traversal
  if (fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) {
    return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Invalid file name"));
  }

  // Parse username. Ex: voice-username-timestamp.mp3
  const username = fileName.split("-")[1];
  if (!username) {
    return next(new ApiError(HTTP_STATUS_CODE.StatusCodes.BAD_REQUEST, "Invalid file name format"));
  }

  // Forward next middleware
  req.username = username;

  next();
};

module.exports = { validateGenVoice: ValidateFunc(genVoiceSchema), validateFilename }; 