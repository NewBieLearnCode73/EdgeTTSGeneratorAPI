const Joi = require("joi")
const ValidateFunc = require("../validators/ValidateFunc")

const genVoiceSchema = Joi.object({
    voice_name: Joi.string().required(),
    text: Joi.string().required(),
    username: Joi.string().required()
})

module.exports = { validateGenVoice: ValidateFunc(genVoiceSchema) }; 