const express = require('express');
const router = express.Router();

let Post = require('../db_models/post');

router.get('/posts', (req, res, next) => {
   Post.find({}, (err, docs) => {
    if (docs[0] || err) {
      res.send(err);
    } else {
      res.send(docs);
    }
   })
});

router.post('/post', (req, res, next) => {
  // todo
})

module.exports = router;
