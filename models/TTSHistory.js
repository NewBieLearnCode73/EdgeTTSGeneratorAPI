const mongoose = require("mongoose");

const TTSHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
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
    mp3Path: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

module.exports = mongoose.model("TTSHistory", TTSHistorySchema);
