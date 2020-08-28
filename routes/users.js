var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* Post users - register new user */
router.post('/', function(req, res, next) {
  var { username, email, password } = req.body;
  /*
  console.log('hello');
  console.log(req.body);
  console.log(username);
  console.log(email);
  console.log(password);
  console.log(body);
  */
 
  User.find({email: email}, function (err, docs) {
    if (err) {
      return console.error(err);
    } else if (docs[0]) {
      console.dir(docs);
      res.status(409).json({message: "user already exist with this email"});
    } else {
      hasher({password: password}, function(err, pass, salt, hash){
        var user = new User({
          username: username,
          email: email,
          salt: salt,
          hash: hash
        })

        user.save(function(err,data) {
          if(err) return console.err(err);
          res.json({success: true })
        })
      })      
    }
  })
  
});

module.exports = router;
