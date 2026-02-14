const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// filter
router.get('/filters', verifyToken, async (req, res) => {
    const school_id = req.user.school_id;
    try {
        const [rows] = await db.execute(
            `SELECT DISTINCT class_name, section
        FROM students_tbl
        WHERE school_id = ? AND status = 1`,
            [school_id]
        );

        res.status(200).json(rows);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

// get student
router.get('/students', verifyToken, async (req, res) => {
    const schoolId = req.user.school_id;
    const { class_name, section } = req.query;

    try {
        const [rows] = await db.execute(
            `SELECT student_id, student_name, roll_number, section
      FROM students_tbl
      WHERE school_id = ?
        AND class_name = ?
        AND section = ?
        AND status = 1
      ORDER BY CAST(roll_number AS UNSIGNED) ASC`,
            [schoolId, class_name, section]
        );

        res.status(200).json(rows);
    } catch (err) {
        console.log(err);

        res.status(500).json({ message: "Failed to fetch students" });
    }
});

// submit attendance
router.post("/submit", verifyToken, async (req, res) => {
    const schoolId = req.user.school_id;
    try {
      const { class_name, section, date, attendance } = req.body;
      if (!class_name || !section || !date || !attendance) {
        return res.status(400).json({
          message: "All fields are required",
        });
      }
      const attendanceJSON = JSON.stringify(attendance);
      const sql = `
        INSERT INTO attendance_tbl
        (school_id, class_name, section, student_attendance, date)
        VALUES (?, ?, ?, ?, ?)
      `;
      await db.execute(sql, [
        schoolId,
        class_name,
        section,
        attendanceJSON,
        date,
      ]);
      res.status(200).json({
        message: "Attendance submitted successfully",
      });
    } catch (error) {
      console.error("Attendance submit error:", error);
      res.status(500).json({
        message: "Server error",
      });
    }
  });

module.exports = router;