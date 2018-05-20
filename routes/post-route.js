const express = require('express');
const router = express.Router();
const locale = require('../locale');
const mongoose = require('mongoose');
const pick = require('lodash/pick');
const last = require('lodash/last');

let Post = require('../db_models/post');


router.post('/', (req, res, next) => {
  if (req.body.userId && req.body.title) {
    // create a new post.    
    let post = new Post(req.body)
    post.save((err, doc) => {
      if (doc) {
        res.send(doc);
      } else {
        res.send(err || locale.notFound);
      }
    });
  } else {
    res.send(locale.invalidPost);
  }
});

router.get('/posts/:uid', (req, res, next) => {
  // get one user's 5 posts with 5 comments by default.
  let start = Math.ceil(Math.abs(req.query.start));
  let count = Math.ceil(Math.abs(req.query.count));
  start = !isNaN(Number(start)) && isFinite(start) ? start : 0;
  count = !isNaN(Number(count)) && count <= 20 ? count : 5;
  let userId = req.params.uid;
  userId = mongoose.Types.ObjectId(userId);
  Post.find({
      'userId': userId,
    }).sort({
      _id: -1 // descending order
    })
    .skip(start)
    .limit(count)
    .populate({path:'comments', options: {limit: count} })
    .exec((err, docs) => {
      if (docs[0]) {
        res.send(docs);
      } else {
        res.send(err || locale.notFound);
      }
    });
});

router.put('/:pid', (req, res, next) => {
  const update = {
    $set: req.body
  };
  const options = {
    new: true
  };

  Post.findOneAndUpdate({
    _id: req.params.pid
  }, update, options, (err, doc) => {
    if (doc) {
      let rets = ["title", "description", "content", "createdAt", "updatedAt"];
      res.send(pick(doc, rets));
    } else {
      res.send(err || locale.notFound);
    }
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id
  }, (err, ret) => {
    if (ret) {
      res.send(ret); // {"n":1,"ok":1}
    } else {
      res.send(err || locale.notFound);
    }
  });
});

router.post('/comment/:pid', (req, res, next) => {
  Post.findById(req.params.pid, (err, doc) => {
    if (err) {
      res.send(err);
    } else {
      doc.comments.push(req.body);
      doc.save((err, doc) => {
        if (err) {
          res.send(err || locale.notFound);
        } else {
          res.send(last(doc.comments));
        }
      });
    }
  });
});

router.get('/comments/:pid', (req, res, next) => {
  // get one post's 5 comments by default.
  let count = Math.ceil(Math.abs(req.query.count));
  count = !isNaN(Number(count)) && 0 < count <= 20 ? count : 5;
  Post.findById(req.params.pid)
    .sort({
      _id: -1
    })
    .limit(count)
    .exec((err, docs) => {
      if (docs[0]) {
        res.send(docs);
      } else {
        res.send(err || locale.notFound);
      }
    });
});

module.exports = router;