import React, { useState } from "react";
import FaceCapture from "./FaceCapture";
import axios from "axios";

export default function AddStudentPage() {
  const [studentId, setStudentId] = useState("");
  const [status, setStatus] = useState("");

  const handleEmbedding = async (descriptor) => {
    if (!studentId) return setStatus("⚠️ Enter Student ID first.");

    try {
      const res = await axios.post("http://localhost:5000/api/students/register-face", {
        studentId,
        descriptor,
      });
      setStatus("✅ " + res.data.message);
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "❌ Error registering student. Please try again.";
      setStatus(message);
    }
  };

  return (
    <div style={containerStyle}>
      <h2>Add Student</h2>
      <input
        type="text"
        placeholder="Enter Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={inputStyle}
      />
      <FaceCapture onEmbedding={handleEmbedding} />
      <p style={{ color: status.includes("✅") ? "green" : "red" }}>{status}</p>
    </div>
  );
}

const containerStyle = {
  textAlign: "center",
  marginTop: "30px",
};

const inputStyle = {
  padding: "8px",
  marginBottom: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};
