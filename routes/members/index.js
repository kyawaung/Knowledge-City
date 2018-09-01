var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var question = require('./question');
var knowledge = require('./knowledge');

/* GET user home page. */
router.get('/', function(req, res, next) {
      res.render('members/home');
});

router.use(function(req, res, next){
  if(req.session.user
      || req.path.indexOf('/view') > 0
      || req.path.indexOf('/list') > 0
      || req.path.indexOf('/detail') > 0
    ){
       next();
  }else{

     req.flash('warn', 'Authorization failed! Please login');
     req.flash('forward', req.path);
     res.redirect('/signin'); //redirect to other page
  }
});

/* GET profile page. */
router.get('/profile', function(req, res, next) {
  res.render('members/commons/profile');
});//End profile page.

/* GET profile-setting page. */
router.get('/setting', function(req, res, next) {
        res.render('members/commons/profile-setting');
});//End profile-setting page.

router.use('/question', question);
router.use('/knowledge', knowledge);
module.exports = router;
