var express = require('express');
var router = express.Router();
var Category = require('../../model/Category');
var Question = require('../../model/Question');
var User = require('../../model/User');
var Answer = require('../../model/Answer');
var timeAgo = require('node-time-ago');

/* GET question add page. */
router.get('/add', function(req, res, next) {
  Category.find({}, function(err, rtn) {
    if (err) throw err;
    if (rtn) {
          res.render('members/question/question-add', {
        cate: rtn
        });
    } else {
      throw new Error('Data not found!');
    }
  });

});//End question add page.

// POST question add action.
router.post('/add', function(req, res, next) {
  var question = new Question();
  question.title = req.body.questionTitle;
  question.category = req.body.category;
  question.insertedBy = req.session.user._id;
  question.updatedBy = req.session.user._id;
  question.save(function(err, rtn) {
    if (err) throw err;
    res.json({
      status: true,
      msg: 'success',
      id: rtn._id
    });
  });
});//End question add action.

/*GET question view. */
router.get('/view/:id', function(req, res, next) {
  Question.findById(req.params.id).populate('category').exec(function(err, rtn) {
    if (err) throw err;
    if (rtn) {
        res.render('members/question/question-confirm', {
        que: rtn
        });
    } else {
      throw new Error('Data not found!');
    }
  });
});//End question view.

/* GET,POST question list. */
router.all('/list', function(req, res, next) {
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
        res.render('members/question/question-list', {questions: doc, paging: paging });
    });
  });
});//end question list view

/* GET question modify page. */
router.get('/modify/:id', function(req, res, next) {
  Question.findById(req.params.id).populate('category').exec(function(err, qna) {
    if(err) throw err;
    if (qna) {
      Category.find({}, function(err1, cat) {
        if (err1) throw err1;
        if (cat) {
          res.render('members/question/question-modify', {que:qna, cat: cat});
        } else {
          throw new Error('Data not found!');
        }
      });
    }else{
      throw new Error('Data not found!');
    }
  });
});//End question modify page.

/* POST question modify action. */
router.post('/modify', function(req, res, next) {
    var update = {
    title : req.body.questionTitle,
    category: req.body.category,
    updated: new Date()
    };
    Question.findByIdAndUpdate(req.body.id,update, function(err, rtn) {
      if(err) throw (err);
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  });//End question modify action.

//GET Question Delete.
  router.get('/delete/:id', function(req, res, next){
    Question.findByIdAndRemove(req.params.id, function(err, rtn){
      if(err) throw err;
      res.redirect('/members/question/list');
    });
  });//End get question delete.

  //GET Question Detail.
router.get('/detail/:id', function(req, res, next){
  Question.findByIdAndUpdate(req.params.id,{$inc:{hits:1}}).exec(function(err, rtn) {
    console.log('Nay Linn Oo', rtn);
    if (err) throw err;
    if (rtn) {
      rtn.timeago = timeAgo(rtn.inserted);
      Answer.find({question:req.params.id}).exec(function(err, ans) {
          if (err) throw err;
              if (ans) {
                for(var qna of ans){
                  qna.timeago = timeAgo(qna.inserted);
                }
                res.render('members/question/question-detail', {que: rtn, ans: ans});
              } else {
                throw new Error('Data not found!');
              }
        });
   }else{
     throw new Error('Data not found!');
   }
  });
});//End get question detail.

// POST answer add action.
router.post('/answer', function(req, res, next) {
  var answer = new Answer();
  answer.answer = req.body.answer;
  answer.question = req.body.question;
  Question.findByIdAndUpdate(req.body.question,{$inc:{answers:1}}).exec(function(err, rtn){
    if (err) throw err;
    answer.save(function(err2, rtn) {
      if (err2) throw err2;
      res.json({
        status: true,
        msg: 'success',
        id: rtn._id
      });
    });
  })
});//End answer add action.

module.exports = router;
