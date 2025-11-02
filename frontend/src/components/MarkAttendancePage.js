import React, { useState } from "react";
import axios from "axios";
import FaceCapture from "./FaceCapture";

export default function MarkAttendancePage() {
  const [descriptor, setDescriptor] = useState(null);
  const [status, setStatus] = useState("Waiting for face capture...");
  const [loading, setLoading] = useState(false);

  // ✅ Called when FaceCapture sends embedding
  const handleEmbedding = (embedding) => {
    setDescriptor(embedding);
    setStatus("✅ Face captured! Ready to mark attendance.");
  };

  // ✅ Send descriptor to backend
  const handleMarkAttendance = async () => {
    if (!descriptor) {
      setStatus("⚠️ Please capture your face first.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        "https://student-face-attendance-system.onrender.com/api/attendance/mark-by-face",
        { descriptor }
      );
      setStatus(res.data.message || "✅ Attendance marked successfully!");
    } catch (err) {
      setStatus(err.response?.data?.message || "❌ Error marking attendance. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>📸 Mark Attendance</h2>

        <FaceCapture onEmbedding={handleEmbedding} />

        <button
          onClick={handleMarkAttendance}
          disabled={loading}
          style={{
            ...buttonStyle,
            backgroundColor: loading ? "#6c757d" : "#28a745",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Marking..." : "Mark Attendance"}
        </button>

        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: status.includes("✅")
              ? "#28a745"
              : status.includes("⚠️")
              ? "#ff9800"
              : "#dc3545",
          }}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

// 🎨 Modern Design Styles
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "85vh",
  background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
  fontFamily: "Arial, sans-serif",
};

const cardStyle = {
  background: "#fff",
  padding: "30px 40px",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "420px",
  transition: "transform 0.3s ease",
};

const titleStyle = {
  marginBottom: "20px",
  color: "#333",
  fontSize: "24px",
  fontWeight: "600",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "12px 18px",
  border: "none",
  borderRadius: "8px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  transition: "background 0.3s ease",
};
