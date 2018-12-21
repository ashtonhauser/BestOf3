const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const saltRounds = 10;
const dbUtils = require('../db/utils/dbcreator.js');
const salt = bcrypt.genSaltSync(saltRounds);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/user/register', function(req, res) {
  res.render('user/register');
});

router.post('/user/register', function(req, res) {
  dbUtils.setEmailandPassword(
    req.body.email,
    bcrypt.hashSync(req.body.password, salt)
  ).then((response) => {
    const user = response[0];
    if (user) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      res.render('user/register');
    }
  });
});

router.get('/user/login', function(req, res) {
  if (req.currentUser) return res.redirect('/');
  res.render('user/login');
});

router.post('/user/login', function(req, res) {
  dbUtils.grabUserByEmail(req.body.email).then((response) => {
    const user = response[0];
    if (bcrypt.compareSync(req.body.password, user.password)) {
      req.session.userId = user.id;
      res.redirect('/');
    } else {
      res.render('user/login');
    }
  });
});

router.get('/user/profile', function(req, res){
  res.render('user/profile', {user: req.currentUser});
});

module.exports = router;
