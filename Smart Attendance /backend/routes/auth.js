const express = require('express');
const router = express.Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Register school
router.post('/register', async (req, res) => {
  const { school_name, email, password, mobile, address } = req.body;

  try {
    const [rows] = await db.execute('SELECT email, mobile FROM users_tbl WHERE email = ? OR mobile = ?', [email, mobile]);
    if (rows.length > 0) {
      let error = {};
      rows.forEach(user => {
        if(user.email === email){
          error.email = "Email already registered";
        }
        if(user.mobile === mobile){
          error.mobile = "Mobile already registered";
        }
      })
      return res.status(400).json({error});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const school_id = 'SCH' + Date.now();
    await db.execute(
      'INSERT INTO users_tbl (school_id, school_name, address, mobile, email, password) VALUES (?, ?, ?, ?, ?, ?)',
      [school_id, school_name, address, mobile, email, hashedPassword]
    );

    res.status(201).json({ message: 'School registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login school
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [schools] = await db.execute('SELECT * FROM users_tbl WHERE email = ?', [email]);
    
    if (schools.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const school = schools[0];
    const isMatch = await bcrypt.compare(password, school.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT token
    const token = jwt.sign(
      { 
        school_id: school.school_id, 
        email: school.email,
        role: 'school_admin' 
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.cookie('token', token);
    res.json({ 
      message: 'Login successful', 
      token: token,
      school_name: school.school_name 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// forget password
router.post('/forget-password', async(req, res)=>{
  const { email } = req.body;
  try{
    const [users] = await db.execute('SELECT * FROM users_tbl WHERE email=?', [email]);
    if(users.length === 0)
      return res.status(404).json({ message : "Email Not Found"})

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await db.execute("DELETE FROM otp_verifications WHERE email = ?", [email]);
    await db.execute(
      "INSERT INTO otp_verifications (email, otp, expires_at) VALUES (?, ?, ?)",
      [email, otp, expiresAt]
    );

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It expires in 10 minutes.`
    });
    res.json({ message: "OTP sent successfully" });
  }catch(err){
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
})

// verify otp
router.post('/verify-otp', async(req, res)=>{
  const { email, otp } = req.body;
  try{
    const [records] = await db.execute(
      "SELECT * FROM otp_verifications WHERE email = ? AND otp = ? AND expires_at > NOW()",
      [email, otp]
    );
    if (records.length === 0) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    res.json({ success: true, message: "OTP verified" });
  }catch(err){
    res.status(500).json({ message: "Server error" });
  }
})

// reset password
router.post('/reset-password', async(req, res)=>{
  const { email, otp, newPassword } = req.body;
  try{
    const [records] = await db.execute(
      "SELECT * FROM otp_verifications WHERE email = ? AND otp = ?",
      [email, otp]
    );
    if (records.length === 0) return res.status(400).json({ message: "Action unauthorized" });
    // 2. Hash and Update
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.execute("UPDATE users_tbl SET password = ? WHERE email = ?", [hashedPassword, email]);
    await db.execute("DELETE FROM otp_verifications WHERE email = ?", [email]);
    res.json({ message: "Password updated successfully!" });
  }catch(err){
    res.status(500).json({ message: "Failed to update password" });
  }
})

module.exports = router;