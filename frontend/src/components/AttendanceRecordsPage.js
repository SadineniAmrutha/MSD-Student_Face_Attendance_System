import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get(
          "https://student-face-attendance-system.onrender.com/api/attendance"
        );
        setRecords(res.data);
      } catch (err) {
        console.error("❌ Error fetching attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        Loading attendance records...
      </p>
    );
  }

  if (!records.length) {
    return (
      <p style={{ textAlign: "center", marginTop: "40px" }}>
        No attendance records found.
      </p>
    );
  }

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>📋 Attendance Records</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th>Student ID</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r, i) => (
            <tr
              key={i}
              style={{
                backgroundColor: i % 2 === 0 ? "#f9f9f9" : "#fff",
              }}
            >
              <td>{r.studentId}</td>
              <td>{r.date}</td>
              <td>{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = {
  margin: "20px auto",
  borderCollapse: "collapse",
  width: "60%",
  border: "1px solid #ccc",
  textAlign: "center",
};
