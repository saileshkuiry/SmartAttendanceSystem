import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Login.css"; // Reuse the same CSS for consistency

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);

  // 60-second Timer logic for Resend OTP
  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Request OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/forget-password", { email });
      toast.success("OTP sent to your email!");
      setStep(2);
      setTimer(60);
    } catch (err) {
      toast.error(err.response?.data?.message || "Email not found");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/verify-otp", { email, otp });
      toast.success("OTP Verified!");
      setStep(3);
    } catch (err) {
      toast.error("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/reset-password", { email, otp, newPassword });
      toast.success("Password updated successfully!");
      navigate("/login");
    } catch (err) {
      toast.error("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <div className="login-header">
          <h2>
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verify OTP"}
            {step === 3 && "New Password"}
          </h2>
          <p>
            {step === 1 && "Enter email to receive code"}
            {step === 2 && `Code sent to ${email}`}
            {step === 3 && "Set your strong password"}
          </p>
        </div>

        {/* STEP 1: EMAIL */}
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div className="input-box">
              <label>Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <div className="input-box">
              <label>Enter 6-Digit OTP</label>
              <input
                type="text"
                placeholder="OTP"
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="extra-links" style={{ marginTop: "15px" }}>
              {timer > 0 ? (
                <span>Resend OTP in {timer}s</span>
              ) : (
                <button 
                  type="button" 
                  onClick={handleRequestOtp} 
                  style={{ background: 'none', border: 'none', color: '#0ea5e9', cursor: 'pointer', fontWeight: '600' }}
                >
                  Resend OTP
                </button>
              )}
            </div>
          </form>
        )}

        {/* STEP 3: NEW PASSWORD */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <div className="input-box">
              <label>New Password</label>
              <input
                type="password"
                placeholder="********"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Updating..." : "Reset Password"}
            </button>
          </form>
        )}

        <div className="extra-links">
          <Link to="/login">Back to Login</Link>
        </div>
      </div>
      
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} <strong>Smart Attendance</strong>. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default ForgotPassword;