const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
  candidateName: { type: String, default: "Unknown" },
  durationSeconds: Number,
  videoPath: String,
  lostFocusCount: { type: Number, default: 0 },
  drowsinessCount: { type: Number, default: 0 },
  noFaceCount: { type: Number, default: 0 },
  multipleFaceCount: { type: Number, default: 0 },
  suspiciousEvents: [String],
  integrityScore: Number,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Report", reportSchema);
