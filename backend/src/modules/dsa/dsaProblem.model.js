const mongoose = require("mongoose");

const dsaProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    topic: { type: String, required: true }, // Array, DP, Graph, etc.
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
  },
  { timestamps: true }
);

dsaProblemSchema.index({ title: 1 }, { unique: true });
dsaProblemSchema.index({ topic: 1, difficulty: 1 });

module.exports = mongoose.model("DSAProblem", dsaProblemSchema);
