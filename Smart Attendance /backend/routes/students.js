const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const verifyToken = require('../middleware/authMiddleware');

// add student
router.post('/', verifyToken, async (req, res) => {
  const { student_name, roll_number, class_name, section} = req.body;
  const schoolId = req.user.school_id;
  try {
    const student_id = uuid();
    await db.execute(
      'INSERT INTO students_tbl (school_id, student_id, student_name, roll_number, class_name, section) VALUES (?, ?, ?, ?, ?, ?)',
      [schoolId, student_id, student_name, roll_number, class_name, section]
    );
    res.status(201).json({ message: 'Student added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// get student
router.get('/', verifyToken, async (req, res) => {
  const schoolId = req.user.school_id;
  try {
    const sql = `
      SELECT * FROM students_tbl WHERE students_tbl.school_id = ?`;
    const [rows] = await db.execute(sql, [schoolId]);
    res.status(200).json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;