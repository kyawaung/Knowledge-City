var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var flash = require('express-flash');

var indexRouter = require('./routes/index');
var user = require('./routes/user/index');
var admin = require('./routes/admin/index');
var category = require('./routes/admin/category');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Set up mongoose connection
mongoose.connect('mongodb://127.0.0.1/knowledgedb');// dirverName://dbIP/dbName
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// plugins in node modules
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/js', express.static(__dirname + '/node_modules/jquery-validation/dist'));

//session
app.use(session({
  secret: 'XailEJS#@S12S', //any string for Security
  resave: false,
  saveUninitialized: true
}));
app.use(flash());//after cookie, session

app.use('/', indexRouter);
app.use('/user', user)
app.use('/admin', admin);
app.use('/category', category);

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
