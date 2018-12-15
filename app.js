var createError = require('http-errors');
var express = require('express');
const session = require('express-session')
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

var indexRouter = require('./routes/index');
var gameRouter = require('./routes/game')

// VIEWS:
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  key: 'user_id',
  secret: 'comeatmebro',
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: 600000
  }
}));
app.use((req, res, next) => {
  if (req.cookies.user_id && !req.session.user) {
    res.clearCookie('user_id');
  }
  next();
});


// views referencing (reference required router variable)
app.use('/', indexRouter);
app.use('/game', gameRouter)

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
