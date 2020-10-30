var express = require('express');
var router = express.Router();
var User = require('../models/user');
var bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
const authMiddleware = require('../middleware/auth');

router.use('/me', authMiddleware)
router.get('/me', function(req, res, next) {
  let userid = req.decoded.userid;
  User.findById(userid)
  .then(doc => {
    let {username, email} = doc;
    res.json({username, email});
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});


router.use('/plants/:_id', authMiddleware);
router.get('/plants/:_id', function(req, res, next) {
  let userid = req.decoded.userid;
  let plant_id = req.params._id;
  User.findById(userid)
  .then(doc => {
    let plant = doc.plants.id(plant_id);
    // console.log(plant);
    res.json({ plant })
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});


router.use('/plants', authMiddleware);
router.get('/plants', function(req, res, next) {
  let userid = req.decoded.userid;
  User.findById(userid)
  .then(doc => {
    let { plants } = doc;
    res.json({ plants })
  }).catch(err => {
    console.log(err);
    res.sendStatus(400);
  })
});

router.post('/plants', function(req, res, next) {
  let userid = req.decoded.userid;
  console.log(req.body);
  let { plantname, photo_url, kind } = req.body;
  let plant = { plantname, photo_url, kind };
  User.updateOne(
    { _id: userid },
    { $push: { plants: plant}}
  ).then(res.sendStatus(200))
  .catch(err => {
    console.log(err);
    res.sendStatus(400);
  });
});


/* Post users - register new user */
router.post('/', function(req, res, next) {
  let { username, email, password } = req.body;
  if (username === undefined || email === undefined || password === undefined) {
    res.status(400).json({message: "값이 충분하지 않습니다."})
  }
  if (username === '' || email === '' || password === '') {
    res.status(400).json({message: "값이 입력되지 않았습니다."})
  }
  User.find({email: email}, function (err, docs) {
    if (err) {
      return console.error(err);
    } else if (docs[0]) {
      console.log(docs[0]);
      res.status(400).json({message: "이미 해당 사용자가 있습니다."});
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

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
