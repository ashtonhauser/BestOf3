const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const saltRounds = 10;
const dbUtils = require('../db/utils/dbcreator.js');
const salt = bcrypt.genSaltSync(saltRounds);

/* GET home page. */
router.get('/', function(req, res, next) {
  var user;
  if (req.currentUser) {
    user = req.currentUser;
  } else {
    user = null;
  }
  res.render('index', {user: user});
});

router.get('/register', function(req, res) {
  if (req.currentUser) return res.redirect('/');
  res.render('user/register', {onRegister:true});
});

router.post('/register', function(req, res) {
  dbUtils.grabUserByEmail(req.body.email
  ).then((response) => {
    if (response.length < 1 && req.body.password) {
      dbUtils.setEmailandPassword(
        req.body.email,
        bcrypt.hashSync(req.body.password, salt)
      ).then((response) => {
        const user = response[0];
        if (user) {
          req.session.userId = user.id;
          dbUtils.initSnakeStats(
            user.id
          ).then(res.redirect('/'));
        } else {
          res.render('user/register');
        }
      });
    } else {
      res.render('user/register')
    }
  });
});

router.get('/user/login', function(req, res) {
  if (req.currentUser) return res.redirect('/');
  res.render('user/login');
});

router.post('/login', function(req, res) {
  dbUtils.grabUserByEmail(req.body.email).then((response) => {
    const user = response[0];
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        req.session.userId = user.id;
        res.redirect('/')
      } else {
        res.redirect('/')
      }
    } else {
      res.redirect('/')
    }
  });
});

router.get('/stats', function(req, res){
  console.log(req.currentUser)
  dbUtils.grabSnakeWins(req.currentUser.id).then((winsObject) => {
    dbUtils.grabSnakeLosses(req.currentUser.id).then((lossesObject) => {
      res.render('user/profile', {user: req.currentUser, wCount: winsObject[0].wins, lCount: lossesObject[0].losses});
    })
  })
});

router.get('/logout', function(req, res){
  req.session.userId = 'none';
  res.render('index', {user: null});
});

module.exports = router;
