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

//Set session // after sessionsa
app.use(function(req, res, next){
  res.locals.user = req.session.user;
  res.locals.active = req.path; //set active path from menu
  next();
});

app.use('/', indexRouter);
// session check for user, admin...
app.use(function(req, res, next){
  // TODO test session. must delete!!
   req.session.user = {
    _id: '5b7296997a2c042268443cdd',
    name: 'Admin',
    email: 'nay@gmail.com',
    role: 'ADMIN'};
   if(req.session.user){
       next();
 }else{
     req.flash('warn', 'Authorization failed! Please login');
     req.flash('forward', req.path);
     res.redirect('/signin'); //redirect to other page
  }
});
app.use('/user', user)
app.use('/admin', admin);
app.use('/', category);

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
