var express = require('express');
var router = express.Router();
var User = require('../../model/User');

/* GET admin signin page. */
router.get('/admin/signin', function(req, res, next) {
  res.render('admin/commons/admin-signin');
});

router.post('/admin/signin', function(req, res, next) {
  // make model using req.body
  User.findOne({ email: req.body.email}, function(err, user){
    if(err) throw err;
    if(user == null || !User.compare(req.body.password, user.password)){
        req.flash('warn', 'Email not exists or password not matched!!');
        res.redirect('/admim/signin');
    }else{
        req.session.user = {name: user.name, email: user.email};
          res.redirect('/admin/home');
    }// user exists
  });
});


/* INIT admin account  */
router.get('/init', function(req, res, next) {
  // make model using req.body
  var user = new User();
  user.name = 'Admin';
  user.email = 'nay@gmail.com';
  user.password = 'nay1500';

      user.save(function(err, result){
        if(err) throw err;
        req.flash('success', 'Registration successful.Welcome to '+user.name);
        res.redirect('/admin/signin');
      });
});


/* GET admin home page. */
router.get('/admin/home', function(req, res, next) {
  res.render('admin/commons/admin-home');
});

module.exports = router;
