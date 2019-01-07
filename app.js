var createError = require('http-errors');
var express = require('express');
var path = require('path');
const bodyParser = require('body-parser');
var logger = require('morgan');
const uuid = require('uuid/v4');
const session = require('express-session');

var app = express();

var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game')
const dbUtils = require('./db/utils/dbcreator.js');

// app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'kayla',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}))
// VIEWS:
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// views referencing (reference required router variable)
// puts currentUser on req
app.use(function(req, res, next) {
  if (!req.session.userId) return next();
  return dbUtils.grabUserById(req.session.userId).then((response) => {
    if (!response || !response[0]) return next();
    req.currentUser = response[0];
    return next();
  });
});

app.use('/', function(req, res, next) {
  if (!req.session.userId) return next();
  return dbUtils.grabUserById(req.session.userId).then((response) => {
    if (!response || !response[0]) return next();
    req.currentUser = response[0];
    return next();
  });
});

app.use('/', indexRouter);
app.use('/game', gameRouter);

// ERROR HANDLING:
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
