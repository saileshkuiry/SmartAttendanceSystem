var express = require('express');
var router = express.Router();
const db = require('../config/db');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const sql = "SELECT * FROM users";
  db.query(sql, (err, result)=>{
    if(err){
      res.status(500).json({error: err.message});
    }
    res.json(result);
  })
});

module.exports = router;
