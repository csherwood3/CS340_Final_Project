const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./dbcon.js');
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router
  .get('/', function (req, res) {
    const context = { page: "students" };
    const { name, type } = req.query
    const sql = `SELECT *
                FROM Student
                WHERE 1
                ${name ? `AND CONCAT(first_name, ' ', last_name) LIKE CONCAT('%', ?, '%')` : ''}
                ${type ? `AND type = ?` : ''}
                ORDER BY first_name, last_name`;
    const values = [];
    if (name) values.push(name);
    if (type) values.push(type);

    mysql.pool.query(sql, values, function (error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        context.name = name;
        context.type = type;
        context.students = result;
        res.render('students', context);
      }
    });
  });

router
  .post('/', urlencodedParser, function (req, res) {
    const { first_name, last_name, email, type } = req.body;
    const sql = 'INSERT INTO Student (first_name, last_name, email, type) VALUES (?, ?, ?, ?)';
    const values = [first_name, last_name, email, type];

    mysql.pool.query(sql, values, function (error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/students');
      }
    });
  });

router
  .get('/:student_id', function(req, res) {
    const { student_id } = req.params;
    const sql = `SELECT * FROM Student WHERE student_id = ?`;
    const values = [student_id];

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        const context = { student: result[0] };
        res.render('update-student', context);
      }
    });
  });
  
router
  .delete('/:student_id', function(req, res) {
    const { student_id } = req.params;
    const sql = `DELETE FROM Student WHERE student_id = ?`;
    const values = [student_id];
    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify({ error: error }));
        res.status(400).end();
      } else {
        res.write(JSON.stringify({ error: '' }));
        res.status(200).end();
      }
    });
});
  
router
  .put('/:student_id', urlencodedParser, function(req, res) {
    const { student_id } = req.params;
    const { first_name, last_name, email, type } = req.body;
    const sql = `UPDATE Student SET
                first_name = ?, last_name = ?, email = ?, type = ?
                WHERE student_id = ?`;
    const values = [first_name, last_name, email, type, student_id];
    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify({ error: error }));
        res.status(400).end();
      } else {
        res.write(JSON.stringify({ error: '' }));
        res.status(200).end();
      }
    });
});

module.exports = router;