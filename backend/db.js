const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = connectDB;


// // db.js
// const mongoose = require("mongoose");

// const mongoURI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/proctoringDB";

// mongoose.connect(mongoURI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on("connected", () => {
//   console.log("✅ MongoDB connected");
// });
// mongoose.connection.on("error", (err) => {
//   console.error("MongoDB connection error:", err);
// });

// module.exports = mongoose;
