const Joi = require("joi")
const ValidateFunc = require("./ValidateFunc")

const changeRoleSchema = Joi.object({
  userId: Joi.string().required(),
  newRole: Joi.string().required()
});


module.exports = {
    validateChangeRole : ValidateFunc(changeRoleSchema)
}