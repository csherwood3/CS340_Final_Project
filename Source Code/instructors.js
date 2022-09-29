const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('./dbcon.js');
const router = express.Router();

const urlencodedParser = bodyParser.urlencoded({
  extended: false
});

router
  .get('/', function(req, res) {
    const context = { page: "instructors" };
    const { name } = req.query;
    const sql = `SELECT * FROM Instructor
                ${name ? `WHERE CONCAT(first_name, ' ', last_name) LIKE CONCAT('%', ?, '%')` : ''}
                ORDER BY first_name, last_name`;
    const values = [];
    if (name) values.push(name);

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        context.name = name;
        context.instructors = result;
        res.render('instructors', context);
      }
    });
  });

router
  .post('/', urlencodedParser, function(req, res) {
    const { first_name, last_name, email } = req.body;
    const sql = 'INSERT INTO Instructor (first_name, last_name, email) VALUES (?, ?, ?)';
    const values = [first_name, last_name, email];

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        req.method = 'GET';
        res.redirect('/instructors');
      }
    });
  });

router
  .get('/:instructor_id', function(req, res) {
    const { instructor_id } = req.params;
    const sql = `SELECT * FROM Instructor WHERE instructor_id = ?`;
    const values = [instructor_id];

    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        res.write(JSON.stringify(error));
        res.end();
      } else {
        const context = { instructor: result[0] };
        res.render('update-instructor', context);
      }
    });
  });

router
  .delete('/:instructor_id', function(req, res) {
    const { instructor_id } = req.params;
    const sql = `DELETE FROM Instructor WHERE instructor_id = ?`;
    const values = [instructor_id];
    mysql.pool.query(sql, values, function(error, result) {
      if (error) {
        if (error.code == 'ER_ROW_IS_REFERENCED_2') {
          res.write(JSON.stringify({
            error: 'Cannot delete an instructor with existing courses. ' +
                   'Please delete the related courses first.'
          }));
        } else {
          res.write(JSON.stringify({ error: error }));
        }
        res.status(400).end();
      } else {
        res.write(JSON.stringify({ error: '' }));
        res.status(200).end();
      }
    });
});

router
  .put('/:instructor_id', urlencodedParser, function(req, res) {
    const { instructor_id } = req.params;
    const { first_name, last_name, email } = req.body;
    const sql = `UPDATE Instructor SET
                first_name = ?, last_name = ?, email = ?
                WHERE instructor_id = ?`;
    const values = [first_name, last_name, email, instructor_id];
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