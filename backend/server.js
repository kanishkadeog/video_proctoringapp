// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const Session = require("./models/Session");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) {
  console.error("MONGO_URI not found in .env");
  process.exit(1);
}
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// ------------------- ROUTES ------------------- //

// Start a new session
app.post("/api/sessions/start", async (req, res) => {
  const { candidate } = req.body;
  try {
    const session = new Session({ candidate, startedAt: new Date(), events: [] });
    await session.save();
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to start session" });
  }
});

// Log an event
app.patch("/api/sessions/:id/event", async (req, res) => {
  const { id } = req.params;
  const { type, details, timestamp } = req.body;
  try {
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    session.events.push({ type, details, timestamp });
    await session.save();
    res.json({ message: "Event logged", event: { type, details, timestamp } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to log event" });
  }
});

// End session
app.patch("/api/sessions/:id/end", async (req, res) => {
  const { id } = req.params;
  const { events = [] } = req.body; // Receive events from frontend if any
  try {
    const session = await Session.findById(id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    session.endedAt = new Date();
    session.events = [...session.events, ...events];
    await session.save();
    res.json({ message: "Session ended", session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to end session" });
  }
});

// Fetch all reports
app.get("/api/reports", async (req, res) => {
  try {
    const sessions = await Session.find();
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// // backend/server.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const Session = require("./models/Session");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // MongoDB Connection
// const mongoURI = process.env.MONGO_URI;
// if (!mongoURI) {
//   console.error("MONGO_URI not found in .env");
//   process.exit(1);
// }
// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error("MongoDB connection error:", err));

// // Routes
// // Start session
// app.post("/api/sessions/start", async (req, res) => {
//   const { candidate } = req.body;
//   try {
//     const session = new Session({ candidate, startedAt: new Date(), events: [] });
//     await session.save();
//     res.json(session);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to start session" });
//   }
// });

// // End session
// app.patch("/api/sessions/:id/end", async (req, res) => {
//   try {
//     const session = await Session.findByIdAndUpdate(
//       req.params.id,
//       { endedAt: new Date() },
//       { new: true }
//     );
//     res.json(session);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to end session" });
//   }
// });

// // Log focus/object event
// app.post("/api/sessions/:id/event", async (req, res) => {
//   const { type, details } = req.body;
//   try {
//     const session = await Session.findById(req.params.id);
//     session.events.push({ type, details, timestamp: new Date() });
//     await session.save();
//     res.json(session);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to log event" });
//   }
// });

// // Fetch reports
// app.get("/api/reports", async (req, res) => {
//   try {
//     const sessions = await Session.find();
//     // Calculate integrity score
//     const reports = sessions.map((s) => {
//       const focusLostCount = s.events.filter(e => e.type === "focusLost").length;
//       const suspiciousCount = s.events.filter(e => e.type === "suspicious").length;
//       const integrityScore = Math.max(0, 100 - (focusLostCount * 5 + suspiciousCount * 5));
//       return {
//         _id: s._id,
//         candidate: s.candidate,
//         startedAt: s.startedAt,
//         endedAt: s.endedAt,
//         focusLostCount,
//         suspiciousCount,
//         integrityScore,
//         events: s.events,
//       };
//     });
//     res.json(reports);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Failed to fetch reports" });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
