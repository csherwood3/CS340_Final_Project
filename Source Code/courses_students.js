const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./dbcon.js');
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
    extended: false
});

router
  .get('/', function (req, res) {
    const context = { page: "courses-students" };

    const { filter_type, name, id, student_name, student_id } = req.query;
    const sql = `SELECT c.course_id, c.name, c.year, c.term,
                s.student_id, CONCAT(s.first_name, ' ', s.last_name) AS 'student_name', s.type AS student_type
                FROM Course_Student cs
                INNER JOIN Course c on cs.course_id = c.course_id
                INNER JOIN Student s on cs.student_id = s.student_id
                WHERE 1
                ${name ? `AND c.name LIKE CONCAT('%', ?, '%')` : ''}
                ${student_name ? `AND CONCAT(s.first_name, ' ', s.last_name) LIKE CONCAT('%', ?, '%')` : ''}
                ORDER BY c.year DESC, c.term, c.name`;
    const values = [];
    if (name) values.push(name);
    if (student_name) values.push(student_name);

    mysql.pool.query(sql, values, function (error, result) {
      if (error) {
          res.write(JSON.stringify(error));
          res.end();
      } else {
        context.filter_type = filter_type ? filter_type : "by_name";
        context.name = name;
        context.student_name = student_name;
        context.courses_students = result;
        // gets all courses for dropdown
        const course_sql = 'SELECT * FROM Course ORDER BY course_id';
        mysql.pool.query(course_sql, function (error, result) {
          if (error) {
            res.write(JSON.stringify(error));
            res.end();
          } else {
            context.courses = result;
            // gets all students for dropdown
            const student_sql = 'SELECT * FROM Student ORDER BY student_id';
            mysql.pool.query(student_sql, function (error, result) {
              if (error) {
                res.write(JSON.stringify(error));
                res.end();
              } else {
                context.students = result;
                res.render('courses_students', context);
              }
            })
          }
        })
      }
    })
  });

router
  .post('/', urlencodedParser, function(req, res) {
    const { course_id, student_id } = req.body;
    const sql = 'INSERT INTO Course_Student (course_id, student_id) VALUES (?, ?)';
    const values = [course_id, student_id];

    mysql.pool.query(sql, values, function (error, result) {
      if (error) {
        // if adding duplicate entry, ignore
        if (error.code == 'ER_DUP_ENTRY') {
          res.redirect('/courses-students');
        } else {
          res.write(JSON.stringify(error));
          res.end();
        }
      } else {
        res.redirect('/courses-students');
      }
    });
  });

router
  .delete('/', function(req, res) {
    const { course_id, student_id } = req.query;
    const sql = `DELETE FROM Course_Student WHERE course_id = ? AND student_id = ?`;
    const values = [course_id, student_id];
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