const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Present" },
});

// ✅ Use existing model if already compiled
const Attendance =
  mongoose.models.Attendance ||
  mongoose.model("Attendance", attendanceSchema);

module.exports = Attendance;
