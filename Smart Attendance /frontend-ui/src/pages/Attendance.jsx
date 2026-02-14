import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/Attendance.css";

const Attendance = () => {
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [filters, setFilters] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // Load class & section filters
  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get("/api/attendance/filters", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFilters(res.data);
  };

  // Load students when filter changes
  useEffect(() => {
    if (className && section) {
      fetchStudents();
    }
  }, [className, section]);

  const fetchStudents = async () => {
    const token = localStorage.getItem("token");

    const res = await axios.get(
      `/api/attendance/students?class_name=${className}&section=${section}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const sortedStudents = res.data.sort(
      (a, b) => Number(a.roll_number) - Number(b.roll_number)
    );
    
    setStudents(sortedStudents);

    // setStudents(res.data);
    setAttendance({});
  };
  
  const handleAttendance = (id, status) => {
    setAttendance({ ...attendance, [id]: status });
  };

  const submitAttendance = async () => {
    try {
      if (!className || !section) {
        toast.error("Please select class and section");
        return;
      }
  
      if (Object.keys(attendance).length === 0) {
        toast.error("Please mark attendance");
        return;
      }
  
      const token = localStorage.getItem("token");
  
      const payload = {
        class_name: className,
        section: section,
        date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
        attendance: attendance,
      };
  
      await axios.post("/api/attendance/submit", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      toast.success("Attendance submitted successfully");
  
      // Optional reset
      setAttendance({});
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit attendance"
      );
    }
  };

  return (
    <div className="manual-container">
      <header className="manual-header">
        <h2>Attendance</h2>
      </header>

      {/* Class Select */}
      <div className="manual-card">
        <label>Select Class</label>
        <select value={className} onChange={(e) => setClassName(e.target.value)}>
          <option value="">-- Select Class --</option>
          {[...new Set(filters.map((f) => f.class_name))].map((cls) => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>

        <label style={{ marginTop: "10px" }}>Select Section</label>
        <select value={section} onChange={(e) => setSection(e.target.value)}>
          <option value="">-- Select Section --</option>
          {[...new Set(filters.map((f) => f.section))].map((sec) => (
            <option key={sec} value={sec}>
              {sec}
            </option>
          ))}
        </select>
      </div>

      {/* Student List */}
      {students.length > 0 && (
        <div className="manual-card">
          <h3>Students</h3>

          <div className="student-list">
            {students.map((student) => (
              <div className="student-row" key={student.student_id}>
                <div className="student-info">
                  <strong>{student.student_name}</strong>
                  <span>Roll Number: {student.roll_number}</span>
                  <span>Section: {student.section}</span>
                </div>

                <div className="attendance-buttons">
                  <button
                    className={
                      attendance[student.student_id] === "Present"
                        ? "present active"
                        : "present"
                    }
                    onClick={() =>
                      handleAttendance(student.student_id, "Present")
                    }
                  >
                    P
                  </button>

                  <button
                    className={
                      attendance[student.student_id] === "Absent"
                        ? "absent active"
                        : "absent"
                    }
                    onClick={() =>
                      handleAttendance(student.student_id, "Absent")
                    }
                  >
                    A
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="submit-btn" onClick={submitAttendance}>
            Submit Attendance
          </button>
        </div>
      )}
    </div>
  );
};

export default Attendance;

