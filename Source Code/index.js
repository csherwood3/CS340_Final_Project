require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('./dbcon.js');
const { PORT } = require('./config.js');

// Set up the server:
const app = express();

app.set('view engine', 'handlebars');
app.set('port', PORT);

const handlebars = require('express-handlebars').create({
  helpers: {
    ifCond: function(v1, operator, v2, options) {
      switch (operator) {
          case '==':
              return (v1 == v2) ? options.fn(this) : options.inverse(this);
          case '===':
              return (v1 === v2) ? options.fn(this) : options.inverse(this);
          case '!=':
              return (v1 != v2) ? options.fn(this) : options.inverse(this);
          case '!==':
              return (v1 !== v2) ? options.fn(this) : options.inverse(this);
          case '<':
              return (v1 < v2) ? options.fn(this) : options.inverse(this);
          case '<=':
              return (v1 <= v2) ? options.fn(this) : options.inverse(this);
          case '>':
              return (v1 > v2) ? options.fn(this) : options.inverse(this);
          case '>=':
              return (v1 >= v2) ? options.fn(this) : options.inverse(this);
          case '&&':
              return (v1 && v2) ? options.fn(this) : options.inverse(this);
          case '||':
              return (v1 || v2) ? options.fn(this) : options.inverse(this);
          default:
              return options.inverse(this);
      }
    },
  },
  defaultLayout:'main'
});

app.engine('handlebars', handlebars.engine);

app.use(express.static(path.join(__dirname, '/public')));

// Set up routes:
app.use('/instructors', require('./instructors.js'));
app.use('/courses', require('./courses.js'));
app.use('/textbooks', require('./textbooks.js'));
app.use('/students', require('./students.js'));
app.use('/courses-students', require('./courses_students.js'));

app.get('/', function(req, res, next) {
  const context = {};
  res.render('home', context);
});

/** Generic 404 handlebars render */
app.use(function(req, res) {
  res.status(404);
  res.render('404');
});

/** Generic 500 handlebars render */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

/** Start the server: */
app.listen(app.get('port'), function() {
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
