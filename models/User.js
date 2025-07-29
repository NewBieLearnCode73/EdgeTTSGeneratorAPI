const mongoose = require("mongoose");
const uuid = require("uuid");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
      unique: true,
    },

    email: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 50,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    codeVerification: {
      type: String,
      default: () => uuid.v4(),
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ username: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
