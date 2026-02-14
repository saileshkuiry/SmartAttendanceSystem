import React, { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import "../styles/AddTeacher.css";

const AddTeacher = () => {
  const [form, setForm] = useState({
    teacher_name: "",
    email: "",
    qualification: "",
    teachers_mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "/api/teachers",
        form,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Teacher added successfully!");

      // Reset form
      setForm({
        teacher_name: "",
        email: "",
        qualification: "",
        teachers_mobile: "",
      });

    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-teacher-container">
      {/* Header */}
      <div className="form-header">
        <h2>Add Teacher</h2>
        <p>Enter teacher details below</p>
      </div>

      {/* Form Card */}
      <form className="form-card" onSubmit={handleSubmit}>
        {error && <p className="error-text">{error}</p>}

        <div className="input-group">
          <label>Teacher Name :</label>
          <input
            type="text"
            name="teacher_name"
            placeholder="Enter full name"
            value={form.teacher_name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Email :</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Qualifications :</label>
          <input
            type="text"
            name="qualification"
            placeholder="Qualifications..."
            value={form.qualification}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label>Mobile Number :</label>
          <input
            type="text"
            name="teachers_mobile"
            placeholder="Number"
            value={form.teachers_mobile}
            onChange={handleChange}
            required
          />
        </div>

        <button className="submit-btn" disabled={loading}>
          {loading ? "Adding..." : "Add Teacher"}
        </button>
      </form>
    </div>
  );
};

export default AddTeacher;
