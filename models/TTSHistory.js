const mongoose = require("mongoose");

const TTSHistorySchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    voice: {
      type: String,
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

TTSHistorySchema.index({ username: 1, fileName: 1 }, { unique: true });

module.exports = mongoose.model("TTSHistory", TTSHistorySchema);
