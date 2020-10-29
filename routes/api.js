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
  console.log(req.params.filename);
  const file_extenstion = req.query.filename.split('.').pop();
  const file_type = req.query.filetype;
  console.log("1");
  console.log(file_extenstion);
  console.log(file_type);
  const key = 'userplants/' + userid + '/' + uuidv4() + "." + file_extenstion;
  const params = {
    Bucket: 'plant-manager',
    Key: key,
    ContentType: file_type,
    ACL: 'public-read'
  }
  console.log(params);
  const signedUrl = s3.getSignedUrl('putObject',params);
  console.log(signedUrl);
  res.send({signedUrl,key});
});

/* health check */
router.get('/hello', function(req, res, next) {
  res.sendStatus(200);
});

module.exports = router;
