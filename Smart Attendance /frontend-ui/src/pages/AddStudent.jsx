import React, { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import {
  FaUserGraduate,
  FaIdBadge,
  FaSchool,
  FaLayerGroup,
  FaSave,
} from "react-icons/fa";
import "../styles/AddStudent.css";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "",
    rollNo: "",
    className: "",
    section: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // ✅ Convert frontend fields → backend payload
    const payload = {
      student_name: formData.name,
      roll_number: formData.rollNo,
      class_name: formData.className,
      section: formData.section,
    };

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/students",
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Student added successfully!");

      // ✅ Reset form
      setFormData({
        name: "",
        rollNo: "",
        className: "",
        section: "",
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-student-container">
      {/* Header */}
      <div className="add-student-header">
        <FaUserGraduate />
        <div>
          <h2>Add Student</h2>
          <p>Register a new student</p>
        </div>
      </div>

      {/* Form */}
      <form className="student-form" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <div className="input-group">
          <FaUserGraduate />
          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaIdBadge />
          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaSchool />
          <input
            type="text"
            name="className"
            placeholder="Class"
            value={formData.className}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <FaLayerGroup />
          <input
            type="text"
            name="section"
            placeholder="Section (A, B, C)"
            value={formData.section}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="save-btn" disabled={loading}>
          <FaSave /> {loading ? "Saving..." : "Enroll Student"}
        </button>
      </form>
    </div>
  );
};

export default AddStudent;
