const mongoose = require("mongoose");

const VoiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  gender: {
    type: String,
    enum: ["Male", "Female"],
    required: true,
  },
  categories: {
    type: [String],
    default: [],
  },
  personalities: {
    type: [String],
    default: [],
  },
});

VoiceSchema.index({ name: 1 }, { unique: true });

module.exports = mongoose.model("Voice", VoiceSchema);