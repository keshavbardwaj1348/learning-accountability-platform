const mongoose = require("mongoose");

const userDsaProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DSAProblem",
      required: true,
    },
    status: {
      type: String,
      enum: ["NOT_STARTED", "SOLVED"],
      default: "NOT_STARTED",
    },
    selfRating: {
      type: Number,
      enum: [1, 3, 7],
      default: 1,
    },
    lastSolvedAt: {
      type: Date,
      default: null,
    },
    nextRevisionDate: {
      type: Date,
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

userDsaProgressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model("UserDSAProgress", userDsaProgressSchema);
