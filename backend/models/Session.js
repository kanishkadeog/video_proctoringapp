// backend/models/Session.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  type: String,
  details: String,
  timestamp: Date,
});

const sessionSchema = new mongoose.Schema({
  candidate: String,
  startedAt: { type: Date, default: Date.now },
  endedAt: Date,
  events: [eventSchema],
});

module.exports = mongoose.model("Session", sessionSchema);


// // backend/models/Session.js
// const mongoose = require("mongoose");

// const EventSchema = new mongoose.Schema({
//   type: String, // "focusLost" or "suspicious"
//   details: String,
//   timestamp: Date
// });

// const SessionSchema = new mongoose.Schema({
//   candidate: String,
//   startedAt: Date,
//   endedAt: Date,
//   events: [EventSchema]
// });

// module.exports = mongoose.model("Session", SessionSchema);
