import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    school_name: "",
    address: "",
    mobile: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post(
        "/api/auth/register",
        {
          school_name: formData.school_name.trim(),
          address: formData.address.trim(),
          mobile: formData.mobile.trim(),
          email: formData.email.trim(),
          password: formData.password,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success("Registration successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      const apiError = error.response?.data?.error;
      if (apiError) {
        if (apiError.email) toast.error(apiError.email);
        if (apiError.mobile) toast.error(apiError.mobile);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <h2>Institute Registration</h2>
          <p>Smart Attendance System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <label>School Name</label>
            <input
              type="text"
              name="school_name"
              placeholder="Enter school name"
              value={formData.school_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Mobile</label>
            <input
              type="text"
              name="mobile"
              placeholder="Enter mobile number"
              value={formData.mobile}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-box password-box">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <div className="extra-links">
          <span>Already have an account?</span>
          <Link to="/login">Login</Link>
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} <strong>Smart Attendance</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Register;
