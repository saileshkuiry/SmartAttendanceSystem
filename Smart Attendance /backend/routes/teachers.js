const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const verifyToken = require('../middleware/authMiddleware');

// add teacher
router.post('/', verifyToken, async (req, res) => {
  const { teacher_name, email, qualification, teachers_mobile } = req.body;
  const schoolId = req.user.school_id;

  try {
    const [existing] = await db.execute('SELECT email FROM teachers_tbl WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const teacher_id = uuid();
    await db.execute(
      'INSERT INTO teachers_tbl (school_id, teacher_id, teacher_name, email, qualification, teachers_mobile) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, teacher_id, teacher_name, email, qualification, teachers_mobile]
    );

    res.status(201).json({ message: 'Teacher added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// get teacher
router.get('/', verifyToken, async (req, res) => {
  const schoolId = req.user.school_id;
  try {
    const [rows] = await db.execute('SELECT * FROM teachers_tbl WHERE school_id = ?', [schoolId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;