const mongoose = require("mongoose");

const UserQuotaSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  requests: {
    type: Number,
    default: 0,
  },
  limit: {
    type: Number,
    default: 50,
  },
});

module.exports = mongoose.model("UserQuota", UserQuotaSchema);