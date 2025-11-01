const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Helper: Euclidean distance
function euclideanDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

// ✅ Mark attendance by face
router.post("/mark-by-face", async (req, res) => {
  try {
    const { descriptor } = req.body;

    if (!descriptor) {
      return res.status(400).json({ message: "Descriptor required" });
    }

    const students = await Student.find();
    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    const threshold = 0.5;
    let matchedStudent = null;
    const newDescriptor = Float32Array.from(descriptor);

    for (let student of students) {
      if (!student.descriptor) continue;

      const existingDesc = Float32Array.from(student.descriptor);
      const distance = euclideanDistance(existingDesc, newDescriptor);

      if (distance < threshold) {
        matchedStudent = student;
        break;
      }
    }

    if (!matchedStudent) {
      return res.status(404).json({ message: "Face not recognized" });
    }

    // ✅ Prevent duplicate marking for the same day
    const today = new Date().toISOString().split("T")[0];
    const alreadyMarked = matchedStudent.attendance.some(
      (record) => new Date(record.date).toISOString().split("T")[0] === today
    );

    if (alreadyMarked) {
      return res.status(400).json({
        message: "⚠️ Attendance already marked for today.",
        studentId: matchedStudent.studentId,
      });
    }

    // ✅ Update attendance
    matchedStudent.attendance.push({ date: new Date(), status: "Present" });
    await matchedStudent.save();

    res.json({
      message: "✅ Attendance marked successfully!",
      studentId: matchedStudent.studentId,
    });
  } catch (err) {
    console.error("Error marking attendance:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
