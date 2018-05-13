const express = require('express');
const router = express.Router();
const locale = require('../locale');
const mongoose = require('mongoose');


let Post = require('../db_models/post');

router.post('/', (req, res, next) => {
  let post = req.body;
  if (post.userId && post.title) {
    post = new Post({
      userId: post.userId,
      title: post.title,
      description: post.description || "",
      content: post.content || ""
    });

    post.save(err => {
      if (err) {
        res.send(err);
      } else {
        res.send('true');
      }
    });
  } else {
    res.send(locale.invalidEmail);
  }
})

router.get('/posts/:uid', (req, res, next) => {
  // get one user's all posts.
  let userId = req.params.uid;
  userId = mongoose.Types.ObjectId(userId);
  Post.find({ 'userId': userId }, (err, docs) => {
    if (docs[0]) {
      res.send(docs);
    } else {
      res.send(err);
    }
  })
});

router.put('/:id', (req, res, next) => {
  Post.findOneAndUpdate({ _id: req.params.id }, req.body, (err, doc) => {
    if (doc) {
      res.send('true');
    } else {
      res.send(err)
    }
  })
})

module.exports = router;