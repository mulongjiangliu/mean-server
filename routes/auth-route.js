const express = require('express');
const encryption = require('../core/encryption');
const bodyParser = require('body-parser');
const locale = require('../locale');
const router = express.Router();
const pick = require('lodash/pick');

let Auth = require('../db_models/auth');

const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;


async function duplicatedName(name) {
  let ret = '';
  await Auth.findOne({
    'email': name
  }, (err, doc) => {
    if (doc || err) {
      ret = err || locale.existedEmial;
    }
  });
  return ret;
}

router.post('/checkname', bodyParser.text(), async (req, res, next) => {
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
      res.send(true);
    }
  }
})

router.post('/signup', async (req, res, next) => {
  let name = req.body.email;
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
        email: name,
        password: pw
      });

      user.save(err => {
        if (err) {
          res.send(err);
        } else {
          res.send(true);
        }
      });
    }
  }
})

router.post('/signin', (req, res, next) => {
  let email = req.body.email;
  let pw = req.body.password;
  if (!email && !pw) {
    res.send(locale.badRequest);
  } else if (!emailRegex.test(email)) {
    res.send(locale.invalidEmail);
  } else {
    email = encryption.aesEncrypt(email);
    Auth.findOne({
      email: email
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

router.put('/:uid', (req, res, next) => {
  const update = {
    $set: req.body
  };
  const options = {
    new: true
  };

  Auth.findOneAndUpdate({
    _id: req.params.uid
  }, update, options, (err, doc) => {
    if (doc) {
      let rets = ["nickname", "gender", "region", "whatsup"];
      res.send(pick(doc, rets));
    } else {
      res.send(err || locale.notFound);
    }
  });
})

router.get('/protrait/:uid', (req, res, next) => {
  let imgHeader = {
    'Content-Type': 'image/png',
    'Cach-control': 'private',
    'max-age': '10',
    'Vary': 'Accept-Encoding'
  };

  Auth.findById(req.params.uid, (err, doc) => {
    if (doc) {
      res.writeHead('200', imgHeader);
      res.end(doc.protrait, 'binary');
    } else {
      res.send(err || locale.notFound);
    }
  });
});

router.put('/protrait/:uid', bodyParser.raw(), (req, res, next) => {
  const update = {
    $set: {
      protrait: req.body
    }
  };

  Auth.findOneAndUpdate({
    _id: req.params.uid
  }, update, (err, doc) => {
    if (doc) {
      res.send(true);
    } else {
      res.send(err || locale.notFound);
    }
  });
});

module.exports = router;