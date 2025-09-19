// backend/routes/sessions.js
const express = require("express");
const router = express.Router();
const Session = require("../models/Session");

// POST /api/sessions/start
router.post("/start", async (req, res) => {
  try {
    const session = new Session({
      candidate: req.body.candidate,
      startedAt: new Date(),
    });
    await session.save();
    res.json({ sessionId: session._id, candidate: session.candidate });
  } catch (err) {
    res.status(500).send(err.message || err);
  }
});

module.exports = router;
