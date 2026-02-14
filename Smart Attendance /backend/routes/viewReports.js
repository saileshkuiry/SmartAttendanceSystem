const express = require('express');
const router = express.Router();
const db = require('../config/db');
const verifyToken = require('../middleware/authMiddleware');

// get report
router.get('/filters', verifyToken, async (req, res) => {
    const schoolId = req.user.school_id;
    const { class_name, section, date, search } = req.query;
    try {
        const [rows] = await db.execute(
            `SELECT class_name, section, student_attendance, date
             FROM attendance_tbl
             WHERE school_id = ?
             AND class_name = ?
             AND section = ?
             AND date = ?`,
            [schoolId, class_name, section, date]
        );
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No attendance found' });
        }
        const attendanceRow = rows[0];
        const attendanceJSON = JSON.parse(attendanceRow.student_attendance);
        const studentIds = Object.keys(attendanceJSON);
        if (studentIds.length === 0) {
            return res.status(200).json([]);
        }
        const placeholders = studentIds.map(() => '?').join(',');
        let studentQuery = `
            SELECT student_id, student_name, roll_number
            FROM students_tbl
            WHERE school_id = ?
            AND student_id IN (${placeholders})
        `;
        const params = [schoolId, ...studentIds];
        if (search && search.trim() !== '') {
            studentQuery += ` AND (student_name LIKE ? OR roll_number LIKE ?)`;
            params.push(`%${search}%`, `%${search}%`);
        }
        const [students] = await db.execute(studentQuery, params);
        const result = students
            .map(student => ({
                student_id: student.student_id,
                student_name: student.student_name,
                roll_number: student.roll_number,
                attendance: attendanceJSON[student.student_id]
            }))
            .sort((a, b) => Number(a.roll_number) - Number(b.roll_number));
        res.status(200).json({
            class_name: attendanceRow.class_name,
            section: attendanceRow.section,
            date: attendanceRow.date,
            students: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
