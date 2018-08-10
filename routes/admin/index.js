var express = require('express');
var router = express.Router();

/* GET signin page. */
router.get('/admin/signin', function(req, res, next) {
  res.render('admin/commons/admin-signin');
});

module.exports = router;
