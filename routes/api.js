const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const authMiddleware = require('../middleware/auth');
const s3 = new AWS.S3({
  signatureVersion: 'v4', 
  region: 'ap-northeast-2'});
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use('/signedurl', authMiddleware);
router.get('/signedurl', function(req, res, next) {
  const userid = req.decoded.userid;
  console.log(userid);
  const key = 'userplants/' + userid + '/' + uuidv4();
  const params = {
    Bucket: 'plant-manager',
    Key: key
  }
  const signedUrl = s3.getSignedUrl('putObject',params);
  console.log(signedUrl);
  res.send({signedUrl});
});

/* health check */
router.get('/hello', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
