const mongoose = require("mongoose");

const authSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    auth: {
      refreshTokenHash: {
        type: String,
        default: null,
      },
      refreshTokenExpiry: {
        type: Date,
        default: null,
      },
    },

    streak: {
      current: {
        type: Number,
        default: 0,
      },
      longest: {
        type: Number,
        default: 0,
      },
      lastActiveDate: {
        type: Date,
        default: null,
      },
    },
  },
  { timestamps: true }
);

authSchema.index({ email: 1 });

module.exports = mongoose.model("User", authSchema);
