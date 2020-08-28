var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* health check */
router.get('/hello', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
