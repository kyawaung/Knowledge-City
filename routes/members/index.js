var express = require('express');
var router = express.Router();
var User = require('../../model/User');
var question = require('./question');
var knowledge = require('./knowledge');

/* GET user home page. */
router.get('/', function(req, res, next) {
  res.render('members/home');    
});

router.use('/question', question);
router.use('/knowledge', knowledge);
module.exports = router;
