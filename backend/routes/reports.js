const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Report = require("../models/Report");
const { calculateIntegrityScore } = require("../utils/scoreCalculator");

// configure multer to store uploads in /uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "..", "uploads")),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `video_${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// POST /api/reports + optional video upload
router.post("/", upload.single("video"), async (req, res) => {
  try {
    const {
      candidateName,
      durationSeconds,
      lostFocusCount = 0,
      drowsinessCount = 0,
      noFaceCount = 0,
      multipleFaceCount = 0,
      suspiciousEvents = [],
    } = req.body;

    const eventsArray = Array.isArray(suspiciousEvents)
      ? suspiciousEvents
      : typeof suspiciousEvents === "string"
      ? JSON.parse(suspiciousEvents)
      : [];

    const integrityScore = calculateIntegrityScore(100, eventsArray);

    const report = new Report({
      candidateName,
      durationSeconds,
      videoPath: req.file ? `/uploads/${req.file.filename}` : undefined,
      lostFocusCount,
      drowsinessCount,
      noFaceCount,
      multipleFaceCount,
      suspiciousEvents: eventsArray,
      integrityScore,
    });

    await report.save();
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message || err);
  }
});

// GET /api/reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).send(err.message || err);
  }
});

module.exports = router;
