const express = require("express");
const router = express.Router();
const Student = require("../models/Student");

// ✅ Helper function for comparing face embeddings
function euclideanDistance(a, b) {
  if (!a || !b || a.length !== b.length) return Infinity;
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    sum += (a[i] - b[i]) ** 2;
  }
  return Math.sqrt(sum);
}

// ✅ Register new student face (prevent duplicates)
router.post("/register-face", async (req, res) => {
  try {
    const { studentId, descriptor } = req.body;

    if (!studentId || !descriptor) {
      return res
        .status(400)
        .json({ message: "Student ID and face data are required." });
    }

    // 1️⃣ Check if student ID already exists
    const existingById = await Student.findOne({ studentId });
    if (existingById) {
      return res
        .status(400)
        .json({ message: "⚠️ This Student ID is already registered." });
    }

    // 2️⃣ Check if similar face already exists
    const allStudents = await Student.find();
    const threshold = 0.45; // stricter threshold for duplicates
    const newDescriptor = Float32Array.from(descriptor);

    for (let student of allStudents) {
      if (student.descriptor) {
        const existingDesc = Float32Array.from(student.descriptor);
        const distance = euclideanDistance(existingDesc, newDescriptor);
        if (distance < threshold) {
          return res.status(400).json({
            message:
              "⚠️ This face is already registered under a different Student ID.",
          });
        }
      }
    }

    // 3️⃣ Save new student
    const newStudent = new Student({ studentId, descriptor });
    await newStudent.save();

    res.json({ message: "✅ Student registered successfully!" });
  } catch (err) {
    console.error("Error registering student:", err);
    res.status(500).json({ message: "Server error while registering face." });
  }
});

// ✅ Get all students
router.get("/", async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch students." });
  }
});

module.exports = router;
