const express = require('express');
const crypto = require('crypto');
const bodyParser = require('body-parser');
const Auth = require('../db_models/auth');

let router = express.Router();

const sha = 'RSA-SHA256';
const salt = 'mean';
const txtParser = bodyParser.text();

function encrypt(password) {
  let sha256 = crypto.createHash(sha);
  sha256.update(password + salt);
  return sha256.digest('hex');
}

async function duplicatedName(name) {
  let ret = '';
  await Auth.findOne({
    'username': name
  }, (err, doc) => {
    if (doc || err) {
      ret = err || 'Name already exits!';
    }
  });
  return ret;
}

router.post('/checkname', txtParser, async (req, res, next) => {
  let name = req.body;
  if (!name) {
    res.send('bad request or content type.');
  } else if (/[\."$*<>:|?\/]/.test(name)) {
    res.send('Special characters are not allowed.');
  } else {
    let duplicate = await duplicatedName(name);
    if (duplicate) {
      res.send(JSON.stringify(duplicate));
    } else {
      res.send('true');
    }
  }
})

router.post('/signup', async (req, res, next) => {
  let name = req.body.username;
  let pw = req.body.password;
  if (!name && !pw) {
    res.send('bad request or content type.');
  } else if (/[\."$*<>:|?\/]/.test(name)) {
    res.send('Special characters are not allowed.');
  } else {
    pw = encrypt(pw);
    let duplicate = await duplicatedName(name);
    if (duplicate) {
      res.send(duplicate);
    } else {
      let user = new Auth({
        username: name,
        password: pw
      });
      user.save((err) => {
        if (err) {
          res.send(err);
        } else {
          res.send('true');
        }
      });
    }
  }
})

router.post('/signin', (req, res, next) => {
  let name = req.body.username;
  let pw = req.body.password;
  if (!name && !pw) {
    res.send('bad request or content type.');
  } else if (/[\."$*<>:|?\/]/.test(name)) {
    res.send('Special characters are not allowed.');
  } else {
    Auth.findOne({
      username: name
    }, (err, doc) => {
      if (!doc || err) {
        res.send(err || 'Please sign up first.');
      } else if (doc.password !== encrypt(pw)) {
        res.send('Wrong password! Please try again.');
      } else {
        res.send('true');
      }
    });
  }
});

module.exports = router;