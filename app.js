const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors')
const mongoose = require('mongoose');

const indexRoute = require('./routes/index');
const authRoute = require('./routes/auth-route');
const postRoute = require('./routes/post-route');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, '/client/views'));
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '/client/public')));

app.use('/', indexRoute, );
app.use('/auth', authRoute)
app.use('/post', postRoute)
app.use('*', indexRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
