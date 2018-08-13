var express = require('express');
var multer = require('multer');
var router = express.Router();
var Category = require('../../model/Category');
var upload = multer({ dest: 'public/upload' });

/* GET manage category page. */
router.get('/', function(req, res, next) {
  res.render('admin/category');
});

// POST category action
router.post('/', function(req, res, next) {
  Category.find({}, function(err, doc){
    if(err) res.json(500, {'err': err.message});
    else res.json({ categories: doc});
  });
});

/* Insert sample data */
router.get('/samples', function(req, res, next){
    // make model using req.body
    var data = [
        {name: {my:'ပညာေရး'}, dispOrder:0},
        {name: {my:'စီးပွားေရး'}, dispOrder:1},
        {name: {my:'ကျန်းမာရေး'}, dispOrder:2},
        {name: {my:'မိုးေလ၀သ'}, dispOrder:3},
        {name: {my:'နည်းပညာ'}, dispOrder:4},
    ];

    // save to database using Model
    console.log('save data', data);
    Category.insertMany(data, function(err, docs){
        if(err) throw err;
        console.log('result', docs);
        res.end('ok');
    });
});

//modify popup view
router.post('/view/:id', function(req, res, next) {
  Category.findById(req.params.id, function(err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ categories: rtn});
    });
  });

router.post('/modify', function(req, res, next) {
  Category.findById(req.body.catid, function(err, category){
      category.name.my = req.body.myanmarname;
      category.save(function (err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ Categories: rtn});
      });
    });
  }); //end modify popup view

  //add popup view
  router.post('/add/:id', function(req, res, next) {
    Category.findById(req.params.id, function(err, rtn){
        if(err) res.json(500, {'err': err.message});
        else res.json({ categories: rtn});
      });
    });

  router.post('/add',upload.any(), function(req, res, next) {
    var category = new Category();
    category.name.my = req.body.myanmarname;
    for(var i in req.files){
      category[req.files[i].fieldname] = '/uploads/' + req.files[i].filename;
    }
    category.save(function (err, rtn){
      if(err) res.json(500, {'err': err.message});
      else res.json({ Categories: rtn});
        });
      }); //end add popup view

module.exports = router;
