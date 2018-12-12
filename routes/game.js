var express = require('express');
var router = express.Router();

// SINGLE ROUTES
router.get('/single', function(req, res) {
  res.send('this is single player games');
});

router.get('/single/:id', function(req, res) {
  res.send('this is a single game')
});

// LOCAL MULTI ROUTES
router.get('/multi/local', function(req, res) {
  res.send('this is multi local games')
});

router.get('/multi/local/:id', function(req, res) {
  res.send('this is a local multi game')
});

// ONLINE ROUTES
router.get('/multi/online', function(req, res) {
  res.send('this is online games')
});

router.get('/multi/online/:id', function(req, res) {
  res.send("this is a multi online game")
});


module.exports = router;