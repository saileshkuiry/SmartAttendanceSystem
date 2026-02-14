import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";
import {
  FaChalkboardTeacher,
  FaUserGraduate,
  FaUserPlus,
  FaClipboardList,
  FaChartBar,
  FaClipboardCheck,
  FaBars,          // The "Three Lines" Icon
  FaSignOutAlt,    // Logout Icon
  FaQuestionCircle,// Help Icon
  FaStar,          // Rate Icon
  FaShieldAlt      // Privacy Icon
} from "react-icons/fa";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false); // State for Dropdown
  const menuRef = useRef(null); // To detect clicks outside

  const [stats, setStats] = useState({
    school_name: "",
    school_id: "",
    total_teachers: 0,
    total_students: 0,
  });
  const [loading, setLoading] = useState(true);

  // Close menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Data
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate('/login'); return; }

        const response = await axios.get("/api/dashboard/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(response.data);
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
        }
        // setLoading(false);
      }
    };
    fetchDashboardStats();
  }, [navigate]);

  const handleLogout = () => {
    // if (window.confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("token");
    navigate("/login");
    // }
  };

  if (loading) return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading...</h2>;

  return (
    <div className="admin-container">
      {/* Top Card */}
      <div className="top-card">
        <div className="school-info">
          <div className="logo-wrapper">
            <img
              src="/logo.jpeg"
              alt="Smart Attendance System Logo"
              className="app-logo"
            />
          </div>
          <div>
            <h1>Smart Attendance System</h1>
            <h2>{stats.school_name}</h2>
          </div>
        </div>
        {/* --- MENU SECTION --- */}
        <div className="menu-container" ref={menuRef}>
          {/* Three Lines Button */}
          <button className="menu-btn" onClick={() => setShowMenu(!showMenu)}>
            <FaBars />
          </button>

          {/* The Dropdown Popup */}
          {showMenu && (
            <div className="dropdown-menu">
              <div className="menu-item" onClick={() => navigate('/privacy')}>
                <FaShieldAlt className="menu-icon" /> Privacy Policy
              </div>

              <div className="menu-item">
                <FaStar className="menu-icon" /> Give Rate
              </div>

              <div className="menu-item" onClick={() => navigate('/help')}>
                <FaQuestionCircle className="menu-icon" /> Help
              </div>

              <hr className="menu-divider" />

              <div className="menu-item logout" onClick={handleLogout}>
                <FaSignOutAlt className="menu-icon" /> Logout
              </div>
            </div>
          )}
        </div>
        {/* --- END MENU SECTION --- */}
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat modern">
          <FaChalkboardTeacher className="stat-icon" />
          <div><h4>Teachers</h4><p>{stats.total_teachers}</p></div>
        </div>
        <div className="stat modern">
          <FaUserGraduate className="stat-icon" />
          <div><h4>Students</h4><p>{stats.total_students}</p></div>
        </div>
      </div>

      {/* Actions */}
      <h3 className="section-title">Quick Actions</h3>
      <div className="action-grid">
        <a href="/add-teacher" className="action-card"><FaUserPlus /><span>Add Teacher ➔</span></a>
        <a href="/manage-classes" className="action-card"><FaClipboardList /><span>Manage Classes ➔</span></a>
        <a href="/attendance" className="action-card"><FaClipboardCheck /><span>Today Attendance ➔</span></a>
        <a href="/add-student" className="action-card"><FaUserPlus /><span>Add Students ➔</span></a>
        <a href="/view-reports" className="action-card"><FaChartBar /><span>View Reports ➔</span></a>
      </div>
      <footer className="app-footer">
        <p>
          © {new Date().getFullYear()} Smart Attendance System · All rights reserved
        </p>

        <div className="footer-links">
          <span onClick={() => navigate("/privacy")}>Privacy Policy</span>
          <span onClick={() => navigate("/help")}>Help</span>
          <span>Rate Us</span>
        </div>
      </footer>

    </div>
  );
};

export default Dashboard;