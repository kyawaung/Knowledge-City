var express = require('express');
var router = express.Router();

/* GET manage category page. */
router.get('/admin/category', function(req, res, next) {
  res.render('admin/knowledge/category');
});

module.exports = router;
