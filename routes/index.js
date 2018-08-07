var express = require('express');
var router = express.Router();
var User = require('../model/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('commons/home');
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('commons/sign-up');
});

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
      res.render('commons/sign-up', {title: 'Sign Up', msg:'Duplicated email'});
    }else{
      user.save(function(err, result){
        if(err) throw err;
        req.flash('success', 'Registration successful.Welcome to '+user.name);
        console.log('Name', user.name);
        res.redirect('/signin');
      });
    }

  });
});

/* GET signin page. */
router.get('/signin', function(req, res, next) {
  res.render('commons/sign-in');
});

/* POST signin action. */
router.post('/signin', function(req, res, next) {
  // make model using req.body
  User.findOne({ email: req.body.email}, function(err, user){
    if(err) throw err;
    console.log('selected user:', user);
    if(user == null || !User.compare(req.body.password, user.password)){
      req.flash('warn', 'Email not exists or password not matched!!');
      res.redirect('/signin');
    }else{
      req.session.user = {_id: user._id, name: user.name, email: user.email};
      res.redirect('/');
    }// user exists
  });
});

/*post check duplication.*/
router.post('/signup/duplicate', function(req, res, next){
  User.findOne({email:req.body.email}, function(err, rtn){
    if(err) throw err;
    console.log(rtn);
    if(rtn != null) res.json({status: false, msg: 'Duplicate email'});
    else res.json({status: true});
  });
});

module.exports = router;
