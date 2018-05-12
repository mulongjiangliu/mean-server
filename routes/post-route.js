const express = require('express');
const router = express.Router();
const locale = require('../locale');
const mongoose = require('mongoose');


let Post = require('../db_models/post');

router.post('/new', (req, res, next) => {
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

router.post('/posts', (req, res, next) => {
  // get one user's all posts.
  let userId = req.body.userId;
  if (!userId) {
    res.send(locale.userNotExist);
  } else {
    userId = mongoose.Types.ObjectId(userId);
    Post.find({
      'userId': userId
    }, (err, docs) => {
      if (docs[0]) {
        res.send(docs);
      } else {
        res.send(err);
      }
    })
  }
});


module.exports = router;