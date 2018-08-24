var express = require('express');
var router = express.Router();
var Category = require('../../model/Category');
var Question = require('../../model/Question');
var timeAgo = require('node-time-ago');

/* GET user home page. */
router.get('/', function(req, res, next) {
  res.render('user/home');
});

/* GET post question page. */
router.get('/post-question', function(req, res, next) {
  Category.find({}, function(err, rtn) {
    if (err) throw err;
    if (rtn) {
        res.render('user/post-question', {
      cate: rtn
      });
    } else {
      throw new Error('Data not found!');
    }
  });

});

// POST post question action
router.post('/post-question', function(req, res, next) {
  console.log('Body',req.body);
  var question = new Question();
  question.title = req.body.questionTitle;
  //question.category = req.body.category;
  question.detail.text = req.body.message;
  question.detail.html = req.body.message;
  question.insertedBy = req.session.user.id;
  question.updatedBy = req.session.user._id;
  console.log('data',question);
  question.save(function(err, rtn) {
    if (err) throw err;
    res.json({
      status: true,
      msg: 'success',
      id: rtn._id
    });
  });
});

//get view
router.get('/view/:id', function(req, res, next) {
  Question.findByIdAndUpdate(req.params.id,{$inc : {'hits' : 1}}).exec(function(err, rtn) {
    rtn.timeago = timeAgo(rtn.inserted);
    if (err) throw err;
    if (rtn) {
      res.render('user/question-confirm', {
      que: rtn
      });
    } else {
      throw new Error('Data not found!');
    }
  });
});

//Post view action.
router.post('/view/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, user) {
    if (err) res.json(500, {
      'err': err.message
    });
    else res.json({
      users: user
    });
  });
});


//view campoign list
router.all('/question', function(req, res, next) {
  var query = {};
Question.count(query, function(err, count){
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
  Question.find(query).skip((paging.currpage -1) * paging.perpage).limit(paging.perpage).exec(function(err, doc){
    if(err) throw err;
      for(var qna of doc){
        qna.timeago = timeAgo(qna.inserted);
      }
      res.render('user/question', {questions: doc, paging: paging });
    });
  });
});//end campaign list view

//Get modify view.
router.get('/modify/:id', function(req, res, next) {
  Question.findById(req.params.id, function(err, qna) {
    if(err) throw err;
    if (qna) {
      Category.find({}, function(err1, cat) {
        if (err1) throw err1;
        if (cat) {
          res.render('user/question-modify', {que:qna,cat: cat});
        } else {
          throw new Error('Data not found!');
        }
      });
    }else{
      throw new Error('Data not found!');
    }
  });
});

//Post modify action.
router.post('/modify/:id', function(req, res, next) {
    var update = {
    title : req.body.questionTitle,
    //category: req.body.category,
    detail_text : req.body.message,
    detail_html : req.body.message,
    updated: new Date()
  };
  console.log('Nay Linn', update);
    Question.findByIdAndUpdate(req.params.id, {$set: update}, function(err, rtn) {
      console.log('Nay Chit', rtn);
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });

module.exports = router;
