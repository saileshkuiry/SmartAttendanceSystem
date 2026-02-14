const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const verifyToken = require('../middleware/authMiddleware');

// add class
router.post('/', verifyToken, async (req, res) => {
  const { class_name, section } = req.body;
  const schoolId = req.user.school_id;

  try {
    const class_id = uuid();
    const [result] = await db.execute(
      'INSERT INTO classes_tbl (school_id, class_id, class_name, section) VALUES (?, ?, ?, ?)',
      [schoolId, class_id, class_name, section]
    );
    res.status(201).json({ message: 'Class added successfully', classId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// get class
router.get('/', verifyToken, async (req, res) => {
  const schoolId = req.user.school_id;
  try {
    const [rows] = await db.execute('SELECT * FROM classes_tbl WHERE school_id = ?', [schoolId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;