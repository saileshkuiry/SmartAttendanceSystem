import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        "/api/auth/login",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // console.log("Login Success:", response.data);
      toast.success("Login successful!");

      // Save token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      navigate("/");

    } catch (err) {
      toast.error("Invalid email or password");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>Login Your Institute</h2>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ERROR MESSAGE */}
          {error && <p className="error-text">{error}</p>}

          {/* EMAIL */}
          <div className="input-box">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="input-box password-box">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="********"
                value={form.password}
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
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="extra-links">
          <a href="/forgot-password">Forgot Password?</a>
          <span>•</span>
          <a href="/register">Register</a>
        </div>
      </div>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} <strong>Smart Attendance</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Login;
