var express = require('express');
var router = express.Router();
var User = require('../model/User');

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('members/commons/sign-up');
});//End signup page.

/* POST signup action. */
router.post('/signup', function(req, res, next) {
  // make model using req.body
  var user = new User();
  user.name = req.body.username;
  user.email = req.body.email;
  user.password = req.body.password;
  User.find({email:req.body.email}, function(err, rtn){
    if(err) throw err;
    if(rtn.length>0){
      res.render('members/commons/sign-up', {title: 'Sign Up', msg:'Duplicated email'});
    }else{
      user.save(function(err, result){
        if(err) throw err;
        req.flash('success', 'Registration successful.Welcome to '+user.name);
        console.log('Name', user.name);
        res.redirect('/signin');
      });
    }

  });
});//End signup action.

/* GET signin page. */
router.get('/signin', function(req, res, next) {
  res.render('members/commons/sign-in');
});//End signin page.

/* POST signin action. */
router.post('/signin', function(req, res, next) {
  // make model using req.body
  User.findOne({ email: req.body.email}, function(err, user){
    if(err) throw err;
    if(user == null || !User.compare(req.body.password, user.password)){
      req.flash('warning', 'Email not exists or password not matched!!');
      res.redirect('/signin');
    }else{
      req.session.user = {_id: user._id, name: user.name, email: user.email, role: user.role};
      if(user.role == 'ADMIN'){
        res.redirect('/admin');
      }else res.redirect('/members');
    }// user exists
  });
});//End signin action.

/* INIT admin account  */
router.get('/init', function(req, res, next) {
  // make model using req.body
  var user = new User();
  user.name = 'Admin';
  user.email = 'nay@gmail.com';
  user.password = 'nay1500';
  user.role = 'ADMIN';

      user.save(function(err, result){
        if(err) throw err;
        req.flash('success', 'Registration successful.Welcome to '+user.name);
        res.redirect('/signin');
      });
});//End INIT admin account.

/*post check duplication.*/
router.post('/signup/duplicate', function(req, res, next){
  User.findOne({email:req.body.email}, function(err, rtn){
    if(err) throw err;
    console.log(rtn);
    if(rtn != null) res.json({status: false, msg: 'Duplicate email'});
    else res.json({status: true});
  });
});//End duplication check.

/* GET user sigout. */
router.get('/signout', function(req, res, next) {
  req.session.destroy();
  res.redirect('/members');
});//End signout.

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('members/commons/profile');
});//End profile page.

/* GET profile-setting page. */
router.get('/setting', function(req, res, next) {
        res.render('members/commons/profile-setting');
});//End profile-setting page.

module.exports = router;
