import React, { useState } from "react";
import FaceCapture from "./FaceCapture";
import axios from "axios";

export default function AddStudentPage() {
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState("");

  const handleEmbedding = async (descriptor) => {
    if (!studentId.trim()) {
      setStatus("⚠️ Please enter a valid Student ID.");
      return;
    }

    try {
      const res = await axios.post(
        "https://student-face-attendance-system.onrender.com/api/students/register-face",
        { studentId, descriptor }
      );

      setStatus("✅ " + res.data.message);
      setStudentId(""); // Clear input on success
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "❌ Error registering student. Please try again.";
      setStatus(message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={titleStyle}>🎓 Add New Student</h2>
        <input
          type="text"
          placeholder="Enter Student ID"
          value={studentId}
          onChange={(e) => setStudentId(e.target.value)}
          style={inputStyle}
        />
        <FaceCapture onEmbedding={handleEmbedding} />
        <p
          style={{
            marginTop: "15px",
            fontWeight: "bold",
            color: status.includes("✅") ? "#28a745" : "#dc3545",
          }}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

// 🎨 Modern Styling
const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
  background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
};

const cardStyle = {
  background: "#fff",
  padding: "30px 40px",
  borderRadius: "20px",
  boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
  textAlign: "center",
  width: "400px",
  transition: "transform 0.3s ease",
};

const titleStyle = {
  marginBottom: "20px",
  color: "#333",
  fontSize: "24px",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "16px",
  textAlign: "center",
  outline: "none",
};

