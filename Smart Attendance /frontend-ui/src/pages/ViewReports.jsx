import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/ViewReports.css";

const ViewReports = () => {
  const [filters, setFilters] = useState({
    className: "",
    section: "",
    date: "",
    status: "",
    search: "",
  });

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  // API CALL FUNCTION
  const fetchReports = async () => {
    if (!filters.className || !filters.section || !filters.date) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        "/api/viewreports/filters",
        {
          params: {
            class_name: filters.className,
            section: filters.section,
            date: filters.date,
            search: filters.search, // 🔍 backend search
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const apiData = res.data;

      let formattedReports = apiData.students.map((stu, index) => ({
        id: index + 1,
        student: stu.student_name,
        roll: stu.roll_number,
        className: apiData.class_name,
        section: apiData.section,
        // date: apiData.date.split("T")[0],
        status: stu.attendance,
      }));

      // Status filter (frontend)
      if (filters.status) {
        formattedReports = formattedReports.filter(
          (r) => r.status === filters.status
        );
      }

      setReports(formattedReports);
    } catch (error) {
      console.log(error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // MANUAL APPLY FILTER
  const applyFilter = () => {
    fetchReports();
  };

  // AUTO SEARCH WITH DEBOUNCE
  useEffect(() => {
    const delaySearch = setTimeout(() => {
      if (filters.search !== "") {
        fetchReports();
      }
    }, 500); // ⏳ 500ms debounce

    return () => clearTimeout(delaySearch);
  }, [filters.search]);

  return (
    <div className="report-container">
      {/* Header */}
      <header className="report-header">
        <h2>Attendance Reports</h2>
        <p>View & analyze attendance records</p>
      </header>

      {/* Filters */}
      <div className="report-card">
        <h3>Filter Reports</h3>

        <div className="filter-grid">
          <select name="className" onChange={handleChange}>
            <option value="">Select Class</option>
            <option value="i">i</option>
            <option value="ii">ii</option>
            <option value="iii">iii</option>
            <option value="iv">iv</option>
            <option value="v">v</option>
            <option value="vi">vi</option>
            <option value="vii">vii</option>
            <option value="viii">viii</option>
            <option value="ix">ix</option>
            <option value="x">x</option>
            <option value="xi">xi</option>
            <option value="xii">xii</option>
          </select>

          <select name="section" onChange={handleChange}>
            <option value="">Section</option>
            <option>A</option>
            <option>B</option>
            <option>C</option>
          </select>

          <input type="date" name="date" onChange={handleChange} />

          <select name="status" onChange={handleChange}>
            <option value="">Status</option>
            <option>Present</option>
            <option>Absent</option>
          </select>
        </div>

        <button className="filter-btn" onClick={applyFilter}>
          {loading ? "Loading..." : "Apply Filter"}
        </button>
      </div>

      {/* Reports Table */}
      <div className="report-card">
        <div className="list-header">
          <h3>Report List</h3>

          <input
            type="text"
            placeholder="Search..."
            name="search"
            onChange={handleChange}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Roll</th>
                <th>Student</th>
                <th>C/S</th>
                {/* <th>Section</th> */}
                {/* <th>Date</th> */}
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {reports.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              ) : (
                reports.map((rep) => (
                  <tr key={rep.id}>
                    <td>{rep.roll}</td>
                    <td>{rep.student}</td>
                    <td>{rep.className} / {rep.section}</td>
                    {/* <td>{rep.section}</td> */}
                    {/* <td>{rep.date}</td> */}
                    <td>
                      <span
                        className={
                          rep.status === "Present"
                            ? "status present"
                            : "status absent"
                        }
                      >
                        {rep.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* <button className="export-btn">Export Report (CSV)</button> */}
      </div>
    </div>
  );
};

export default ViewReports;
