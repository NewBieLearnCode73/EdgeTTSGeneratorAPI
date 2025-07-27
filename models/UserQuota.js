const mongoose = require("mongoose");
const ApiError = require("../utils/ApiError");
const HTTP_STATUS_CODE = require("http-status-codes");

const UserQuotaSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 20,
    },
    date: {
      type: Date,
      required: true,
      set: function (val) {
        return new Date(val).setHours(0, 0, 0, 0);
      },
    },
    requests: {
      type: Number,
      default: 0,
      min: 0,
    },
    limit: {
      type: Number,
      default: 50,
      min: 1,
    },
  },
  {
    timestamps: true,
  }
);

UserQuotaSchema.index({ username: 1, date: 1 }, { unique: true });

UserQuotaSchema.statics.getOrCreateDailyQuota = async function (username, date = new Date()) {
  const quotaDate = new Date(date);
  quotaDate.setHours(0, 0, 0, 0);

  const quota = await this.findOne({ username, date: quotaDate });
  if (quota) {
    return quota;
  }

  return await this.create({
    username,
    date: quotaDate,
    requests: 0,
    limit: 5,
  });
};

UserQuotaSchema.methods.canMakeRequest = function () {
  return this.requests < this.limit;
};

UserQuotaSchema.methods.incrementRequest = async function () {
  if (this.canMakeRequest()) {
    this.requests += 1;
    return await this.save();
  }

  throw new ApiError(HTTP_STATUS_CODE.StatusCodes.LOCKED, "Daily quota exceeded");
};

UserQuotaSchema.methods.resetDailyQuota = async function () {
  this.requests = 0;
  return await this.save();
};

module.exports = mongoose.model("UserQuota", UserQuotaSchema);