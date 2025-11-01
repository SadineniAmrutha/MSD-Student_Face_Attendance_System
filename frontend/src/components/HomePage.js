import React from "react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: "#f8fafc",
      }}
    >
      <h1 style={{ fontSize: "28px", marginBottom: "30px" }}>
        Student Face Attendance System
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <button
          onClick={() => navigate("/mark-attendance")}
          style={buttonStyle("#10b981")}
        >
          🎥 Mark Attendance
        </button>

        <button
          onClick={() => navigate("/add-student")}
          style={buttonStyle("#3b82f6")}
        >
          ➕ Add Student
        </button>

        <button
          onClick={() => navigate("/attendance-records")}
          style={buttonStyle("#f59e0b")}
        >
          📋 Attendance Records
        </button>
      </div>
    </div>
  );
}

const buttonStyle = (color) => ({
  backgroundColor: color,
  color: "white",
  border: "none",
  borderRadius: "8px",
  padding: "12px 25px",
  fontSize: "16px",
  cursor: "pointer",
  width: "250px",
});
