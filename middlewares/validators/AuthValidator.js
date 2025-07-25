const Joi = require("joi")

const registerSchema = Joi.object({
    username : Joi.string().alphanum().min(6).max(20).required()})