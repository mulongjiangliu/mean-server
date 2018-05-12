const express = require('express');
const encryption = require('../Services/encryption');
const bodyParser = require('body-parser');
const locale = require('../locale');
const router = express.Router();

let Auth = require('../db_models/auth');

const emailRegex = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
const txtParser = bodyParser.text();

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
    res.send(locale.badRequest);
  } else if (!emailRegex.test(name)) {
    res.send(locale.invalidEmail);
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
    res.send(locale.badRequest);
  } else if (!emailRegex.test(name)) {
    res.send(locale.invalidEmail);
  } else {
    name = encryption.aesEncrypt(name);
    pw = encryption.shaEncrypt(pw);
    let duplicate = await duplicatedName(name);
    if (duplicate) {
      res.send(duplicate);
    } else {
      let user = new Auth({
        username: name,
        password: pw
      });

      user.save(err => {
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
    res.send(locale.badRequest);
  } else if (!emailRegex.test(name)) {
    res.send(locale.invalidEmail);
  } else {
    name = encryption.aesEncrypt(name);
    Auth.findOne({
      username: name
    }, (err, doc) => {
      if (!doc || err) {
        res.send(err || locale.signUp);
      } else if (doc.password !== encryption.shaEncrypt(pw)) {
        res.send(locale.wrongPassword);
      } else {
        res.send({
          "succeeded": true,
          "userId": doc['_id']
        });
      }
    });
  }
});

module.exports = router;