var express = require('express'); 
var router = express.Router();
var jwt = require('jsonwebtoken');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

/* get Auth token */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/me', authMiddleware);
router.get('/me', function(req, res, next) {
  res.status(200).json({
    info: req.decoded
  });
})

router.post('/login', function(req, res, next) {
  const secret = req.app.get('jwt-secret');
  const { email, password } = req.body
  if (email === undefined || password === undefined) {
    res.sendStatus(400); //wrong request
  }
  
  User.findOneByEmail(email)
  .then(doc => {
    if(doc === null){
      res.sendStatus(403); //email not found
    }
    this.username = doc.username;
    return doc.verify(password);
  }).then( val => {
    if (val === false) {
      res.sendStatus(403); //password is not correct 
    } else {
      const token = jwt.sign({username : this.username}, secret);
      res.json({
        token
      });
    }
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(500);
  });
});

module.exports = router;
