import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import MarkAttendancePage from "./components/MarkAttendancePage";
import AddStudentPage from "./components/AddStudentPage";
import AttendanceRecordsPage from "./components/AttendanceRecordsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/mark-attendance" element={<MarkAttendancePage />} />
        <Route path="/add-student" element={<AddStudentPage />} />
        <Route path="/attendance-records" element={<AttendanceRecordsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
