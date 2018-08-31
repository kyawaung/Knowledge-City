var express = require('express');
var router = express.Router();
var category = require('./category');

/* GET admin home page. */
router.get('/', function(req, res, next) {
  res.render('admin/home');
});

router.use('/category', category);

module.exports = router;
