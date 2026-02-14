const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { v4: uuid } = require('uuid');
const verifyToken = require('../middleware/authMiddleware');

// class add
router.post('/', verifyToken, async (req, res) => {
    const { teacher_name, class_name } = req.body;
    const schoolId = req.user.school_id;

    try{
        const manage_class_id = uuid();
        const sql = `INSERT INTO manage_classes_tbl (school_id, manage_class_id, teacher_name, class_name) values(?, ?, ?, ?)`;
        await db.execute( sql, [schoolId, manage_class_id, teacher_name, class_name]);
        res.status(201).json({ message : 'Class assigned successfully' });
    } catch (error){
        console.log(error);
        
        res.status(500).json({ massage : 'Server error' });
    }
  });

// get all teacher list
  router.get('/', verifyToken, async (req,res) =>{
    const schoolId = req.user.school_id;
    const searchTerm = req.query.search ? `%${req.query.search}%` : '%';
    try {
        const sql = `
            SELECT manage_class_id, teacher_name, class_name, status 
            FROM manage_classes_tbl 
            WHERE school_id = ?
            AND status = '1' 
            AND (teacher_name LIKE ? OR class_name LIKE ?)
        `;
        const [rows] = await db.execute(sql, [schoolId, searchTerm, searchTerm]);
        res.status(200).json(rows);
    } catch (error) {
        res.status(500).json({ massage : 'Server error'});
    }
  })

// update class details
  router.post('/update/:manage_class_id', verifyToken, async (req, res) => {
    const { manage_class_id } = req.params;
    const { teacher_name, class_name } = req.body;
    const schoolId = req.user.school_id;

    try {
        const sql = `UPDATE manage_classes_tbl SET teacher_name = ?, class_name = ? WHERE manage_class_id = ? AND school_id = ?`;
        const [result] = await db.execute(sql, [teacher_name, class_name, manage_class_id, schoolId]);
        res.status(201).json({ message: 'Class updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// delete class
router.delete('/delete/:manage_class_id', verifyToken, async (req, res) => {
    const { manage_class_id } = req.params;
    const schoolId = req.user.school_id;

    try {
        const sql = `UPDATE manage_classes_tbl SET status = '0' WHERE manage_class_id = ? AND school_id = ?`;
        await db.execute(sql, [manage_class_id, schoolId]);
        res.status(201).json({ message: 'Class deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// gett teacher name
router.get('/teacher', verifyToken, async (req, res)=> {
    const schoolId = req.user.school_id;
    try {
        const sql = `SELECT teacher_name FROM teachers_tbl WHERE school_id = ?`;
        const [rows] = await db.execute(sql, [schoolId]);
        res.status(201).json(rows);
        
    } catch (error) {
        console.log(error);
        
        res.status(500).json({ massage : 'Server error'});
    }
})

  module.exports = router;