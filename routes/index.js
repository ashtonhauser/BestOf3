const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dbUtils = require('../db/utils/dbcreator.js');
const hashes = {};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/register', function(req, res) {
  res.render('register');
});

router.post('/register', function(req, res) {
  const salt = bcrypt.genSaltSync(saltRounds);
  hashes[req.body.email] = bcrypt.hashSync(req.body.password, salt);
  dbUtils.setEmailAndPassword(req.body.username, hashes[req.body.email]);

  res.render('index');
});

router.get('/login', function(req, res) {
  res.render('login');
})

router.post('/login', function(req, res) {
  if (bcrypt.compareSync(req.body.password, hashes[req.body.email])) {
    res.render('index');
  }
})

module.exports = router;
