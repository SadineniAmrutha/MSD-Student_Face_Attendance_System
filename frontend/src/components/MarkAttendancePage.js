import React, { useState } from "react";
import axios from "axios";
import FaceCapture from "./FaceCapture";

export default function MarkAttendancePage() {
  const [descriptor, setDescriptor] = useState(null);
  const [status, setStatus] = useState("Waiting for face capture...");

  // ✅ Called when FaceCapture sends embedding
  const handleEmbedding = (embedding) => {
    setDescriptor(embedding);
    setStatus("✅ Face captured! Ready to mark attendance.");
  };

  // ✅ Send descriptor to backend
  const handleMarkAttendance = async () => {
    if (!descriptor) {
      setStatus("⚠️ Capture a face first.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/attendance/mark-by-face", {
        descriptor,
      });
      setStatus(res.data.message);
    } catch (err) {
      setStatus(err.response?.data?.message || "❌ Error marking attendance.");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📸 Mark Attendance</h2>
      <FaceCapture onEmbedding={handleEmbedding} />
      <button
        onClick={handleMarkAttendance}
        style={{
          marginTop: "15px",
          padding: "10px 16px",
          backgroundColor: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Mark Attendance
      </button>
      <p style={{ marginTop: "15px", color: "#555" }}>{status}</p>
    </div>
  );
}
