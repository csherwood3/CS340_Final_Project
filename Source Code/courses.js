const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./dbcon.js');
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router
  .get('/', function(req, res) {
    const context = { page: "courses" };
    const { filter_type, name, year, term, instructor_name } = req.query;
    const sql = `SELECT c.course_id, c.name, c.year, c.term, i.instructor_id, CONCAT(i.first_name, ' ', i.last_name) as 'instructor_name', t.textbook_id, t.name as 'textbook_title' 
                FROM Course c
                INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
                LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
                WHERE 1
                ${name ? `AND c.name LIKE CONCAT('%', ?, '%')` : ''}
                ${year ? `AND c.year = ?` : ''}
                ${term ? `AND c.term = ?` : ''}
                ${instructor_name ? `AND CONCAT(i.first_name, ' ', i.last_name) LIKE CONCAT('%', ?, '%')` : ''}
                ORDER BY c.year DESC, c.term, c.name`;
    const values = [];
    if (name) values.push(name);
    if (year) values.push(year);
    if (term) values.push(term);
    if (instructor_name) values.push(instructor_name);

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        context.filter_type = filter_type ? filter_type : "by_name";
        context.name = name;
        context.year = year;
        context.term = term;
        context.instructor_name = instructor_name;
        context.courses = result;
        // gets all instructors for dropdown
        const instructors_sql = 'SELECT * FROM Instructor ORDER BY first_name, last_name';
        mysql.pool.query(instructors_sql, function(error, result) {
          if (error) {
            res.write(JSON.stringify(error));
            res.end();
          } else {
            context.instructors = result;
            // gets all textbooks for dropdown
            const textbooks_sql = 'SELECT * FROM Textbook ORDER BY name';
            mysql.pool.query(textbooks_sql, function(error, result) {
              if (error) {
                res.write(JSON.stringify(error));
                res.end();
              } else {
                context.textbooks = result;
                res.render('courses', context);
              }
            });
          }
        });
      }
    });
  });

router
  .post('/', urlencodedParser, function(req, res) {
    const { name, year, term, instructor_id, textbook_id } = req.body;
    const sql = 'INSERT INTO Course (name, year, term, instructor_id, textbook_id) VALUES (?, ?, ?, ?, ?)';
    const values = [name, year, term, instructor_id, textbook_id ? textbook_id : null];

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        res.redirect('/courses');
      }
    });
  });

router
  .get('/:course_id', function(req, res) {
    const { course_id } = req.params;
    const sql = `SELECT c.course_id, c.name, c.year, c.term, i.instructor_id, CONCAT(i.first_name, ' ', i.last_name) as 'instructor_name', t.textbook_id, t.name as 'textbook_title' 
                FROM Course c
                INNER JOIN Instructor i ON c.instructor_id = i.instructor_id 
                LEFT JOIN Textbook t ON c.textbook_id = t.textbook_id
                WHERE course_id = ?`;
    const values = [course_id];

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        const context = { course: result[0] };
        // gets all instructors for dropdown
        const instructors_sql = 'SELECT * FROM Instructor ORDER BY first_name, last_name';
        mysql.pool.query(instructors_sql, function(error, result) {
          if (error) {
            res.write(JSON.stringify(error));
            res.end();
          } else {
            context.instructors = result;
            // gets all textbooks for dropdown
            const textbooks_sql = 'SELECT * FROM Textbook ORDER BY name';
            mysql.pool.query(textbooks_sql, function(error, result) {
              if (error) {
                res.write(JSON.stringify(error));
                res.end();
              } else {
                context.textbooks = result;
                res.render('update-course', context);
              }
            });
          }
        });
      }
    });
  });

router
  .delete('/:course_id', function(req, res) {
    const { course_id } = req.params;
    const sql = `DELETE FROM Course WHERE course_id = ?`;
    const values = [course_id];
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
  .put('/:course_id', urlencodedParser, function(req, res) {
    const { course_id } = req.params;
    const { name, year, term, instructor_id, textbook_id } = req.body;
    const sql = `UPDATE Course SET
                name = ?, year = ?, term = ?, instructor_id = ?, textbook_id = ?
                WHERE course_id = ?`;
    const values = [name, year, term, instructor_id, textbook_id ? textbook_id : null, course_id];
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