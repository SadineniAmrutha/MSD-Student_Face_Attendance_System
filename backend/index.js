const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config(); // ✅ Load .env file

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// ✅ MongoDB Connection (Local or Atlas)
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/face_attendance";

mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Student Schema
const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  descriptor: { type: [Number], required: true },
});

const Student = mongoose.model("Student", studentSchema);

// ✅ Attendance Schema
const attendanceSchema = new mongoose.Schema({
  studentId: String,
  date: { type: Date, default: Date.now },
  status: { type: String, default: "Present" },
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

// ✅ Register Face (Prevents Duplicate Faces)
app.post("/api/students/register-face", async (req, res) => {
  try {
    const { studentId, descriptor } = req.body;

    if (!studentId || !descriptor)
      return res.status(400).json({ message: "⚠️ Invalid data provided." });

    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent)
      return res
        .status(400)
        .json({ message: "⚠️ Student ID already registered!" });

    // Prevent duplicate faces with different IDs
    const students = await Student.find();
    const threshold = 0.55;
    for (const s of students) {
      const distance = Math.sqrt(
        s.descriptor.reduce((sum, val, i) => sum + (val - descriptor[i]) ** 2, 0)
      );
      if (distance < threshold) {
        return res.status(400).json({
          message: "⚠️ This face is already registered with another Student ID!",
        });
      }
    }

    const newStudent = new Student({ studentId, descriptor });
    await newStudent.save();

    res.json({ message: "✅ Face registered successfully!" });
  } catch (err) {
    console.error("❌ Error registering face:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Mark Attendance by Face (Prevents Duplicate per Day)
app.post("/api/attendance/mark-by-face", async (req, res) => {
  try {
    const { descriptor } = req.body;
    if (!descriptor)
      return res.status(400).json({ message: "⚠️ No face descriptor provided." });

    const students = await Student.find();
    let matchedStudent = null;
    let minDistance = Infinity;
    const threshold = 0.55;

    for (const s of students) {
      const distance = Math.sqrt(
        s.descriptor.reduce((sum, val, i) => sum + (val - descriptor[i]) ** 2, 0)
      );
      if (distance < threshold && distance < minDistance) {
        matchedStudent = s.studentId;
        minDistance = distance;
      }
    }

    if (!matchedStudent)
      return res.status(404).json({ message: "❌ No matching face found." });

    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const alreadyMarked = await Attendance.findOne({
      studentId: matchedStudent,
      date: { $gte: startOfDay, $lte: endOfDay },
    });

    if (alreadyMarked) {
      return res.json({
        message: `⚠️ Attendance already marked today for ${matchedStudent}`,
      });
    }

    await new Attendance({ studentId: matchedStudent }).save();

    res.json({
      message: `✅ Attendance marked successfully for ${matchedStudent}`,
    });
  } catch (err) {
    console.error("❌ Error marking attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get All Attendance Records
app.get("/api/attendance", async (req, res) => {
  try {
    const records = await Attendance.find().sort({ date: -1 });
    const formatted = records.map((rec) => ({
      studentId: rec.studentId,
      date: new Date(rec.date).toISOString().split("T")[0],
      status: rec.status,
    }));
    res.json(formatted);
  } catch (err) {
    console.error("❌ Error fetching attendance records:", err);
    res.status(500).json({ message: "Failed to fetch attendance records" });
  }
});

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🚀 Face Recognition Attendance Backend is running ✅");
});

// ✅ Start Server
app.listen(PORT, () =>
  console.log(`🚀 Backend running on http://localhost:${PORT}`)
);
