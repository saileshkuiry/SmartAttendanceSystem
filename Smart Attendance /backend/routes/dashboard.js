const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// get dashboard data
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const schoolId = req.user.school_id;

    const [school_name] = await db.execute(`SELECT school_name FROM users_tbl WHERE school_id = ?`, 
      [schoolId]
    );
    const [teacherRows] = await db.execute(
      'SELECT COUNT(*) as total FROM teachers_tbl WHERE school_id = ?', 
      [schoolId]
    );
    
    const [studentRows] = await db.execute(
      'SELECT COUNT(*) as total FROM students_tbl WHERE school_id = ?', 
      [schoolId]
    );

    const [classRows] = await db.execute(
      'SELECT COUNT(*) as total FROM classes_tbl WHERE school_id = ?', 
      [schoolId]
    );

    res.status(200).json({
      // school_id: schoolId,
      school_name: school_name[0].school_name,
      total_teachers: teacherRows[0].total,
      total_students: studentRows[0].total,
      total_classes: classRows[0].total
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats' });
  }
});

module.exports = router;