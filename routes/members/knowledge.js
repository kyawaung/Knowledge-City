var express = require('express');
var router = express.Router();
var Category = require('../../model/Category');
var Knowledge = require('../../model/Knowledge');
var Comment = require('../../model/Comment');
var timeAgo = require('node-time-ago');

/* GET knowledge add page. */
router.get('/add', function(req, res, next) {
  Category.find({}, function(err, rtn) {
    if (err) throw err;
    if (rtn) {
        res.render('members/knowledge/knowledge-add', {
      cate: rtn
      });
    } else {
      throw new Error('Data not found!');
    }
  });

});//End knowledge add page.

// POST knowledge add action.
router.post('/add', function(req, res, next) {
  var knowledge = new Knowledge();
  knowledge.title = req.body.knowledgeTitle;
  knowledge.category = req.body.category;
  knowledge.detail.text = req.body.message;
  knowledge.detail.html = req.body.message;
  knowledge.insertedBy = req.session.user._id;
  knowledge.updatedBy = req.session.user._id;
  knowledge.save(function(err, rtn) {
    if (err) throw err;
    res.json({
      status: true,
      msg: 'success',
      id: rtn._id
    });
  });
});//End knowledge add action.

/*GET knowledge view. */
router.get('/view/:id', function(req, res, next) {
  Knowledge.findById(req.params.id).populate('category').exec(function(err, rtn) {
    if (err) throw err;
    if (rtn) {
        res.render('members/knowledge/knowledge-confirm', {
        know: rtn
        });
    } else {
      throw new Error('Data not found!');
    }
  });
});//End knowledge view.

/*POST question view action. */
// router.post('/view/:id', function(req, res, next) {
//   Question.findById(req.params.id, function(err, user) {
//     console.log('Nay Khin',user);
//     if (err) res.json(500, {
//       'err': err.message
//     });
//     else res.json({
//       que: user
//     });
//   });
// });// End question view.


/* GET,POST knowledge list. */
router.all('/list', function(req, res, next) {
  var query = {};
Knowledge.count(query, function(err, count){
  var paging = {
    currpage: Number(req.body.currpage) || 1,
    perpage: Number(req.body.perpage) || 3,
    count: count,
    total: Math.ceil(count/(req.body.perpage || 3)),
    psize: 5,
    skip: {}
  };
  //ToDo start, END\
  paging.start = (Math.ceil(paging.currpage/paging.psize)-1)*paging.psize+1;
  paging.end = paging.start+paging.psize-1;
  if(paging.end>paging.total) paging.end = paging.total;
  //ToDo pre, Next
  paging.skip.next = paging.psize * Math.ceil(paging.currpage/paging.psize) +1;
  paging.skip.prev = paging.skip.next - paging.psize*2;
  Knowledge.find(query).skip((paging.currpage -1) * paging.perpage).limit(paging.perpage).exec(function(err, doc){
    if(err) throw err;
      for(var know of doc){
        know.timeago = timeAgo(know.inserted);
      }
      res.render('members/knowledge/knowledge-list', {knowledges: doc, paging: paging });
    });
  });
});//end knowledge list view

/* GET knowledge modify page. */
router.get('/modify/:id', function(req, res, next) {
  Knowledge.findById(req.params.id).populate('category').exec(function(err, know) {
    if(err) throw err;
    if (know) {
      Category.find({}, function(err1, cat) {
        if (err1) throw err1;
        if (cat) {
          res.render('members/knowledge/knowledge-modify', {know:know, cat: cat});
        } else {
          throw new Error('Data not found!');
        }
      });
    }else{
      throw new Error('Data not found!');
    }
  });
});//End knowledge modify page.

/* POST knowledge modify action. */
router.post('/modify', function(req, res, next) {
    var update = {
    title : req.body.knowledgeTitle,
    category: req.body.category,
    detail:{
      text : req.body.message,
      html : req.body.message
    },
    updated: new Date()
  };
    Knowledge.findByIdAndUpdate(req.body.id,update, function(err, rtn) {
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });//End knowledge modify action.

//GET knowledge Delete.
  router.get('/delete/:id', function(req, res, next){
    Knowledge.findByIdAndRemove(req.params.id, function(err, rtn){
      if(err) throw err;
      res.redirect('/members/knowledge/list');
    });
  });//End get knowledge delete.

  //GET Knowledge Detail.
router.get('/detail/:id', function(req, res, next){
  Knowledge.findByIdAndUpdate(req.params.id,{$inc:{hits:1}}).exec(function(err, rtn) {
    if (err) throw err;
    if (rtn) {
      rtn.timeago = timeAgo(rtn.inserted);
      Comment.find({knowledge:req.params.id}).exec(function(err, com) {
          if (err) throw err;
              if (com) {
                for(var qna of com){
                  qna.timeago = timeAgo(qna.inserted);
                }
                res.render('members/knowledge/knowledge-detail', {know: rtn, com: com});
              } else {
                throw new Error('Data not found!');
              }
        });
   }else{
     throw new Error('Data not found!');
   }
  });
});//End get Knowledge detail.

// POST Comment add action.
router.post('/detail', function(req, res, next) {
  var comment = new Comment();
  comment.comment = req.body.comment;
  comment.knowledge = req.body.knowledge;
  Knowledge.findByIdAndUpdate(req.body.knowledge,{$inc:{comments:1}}).exec(function(err, rtn){
    if (err) throw err;
    comment.save(function(err2, rtn) {
      if (err2) throw err2;
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });
});//End Comment add action.

module.exports = router;
