var fs = require('fs');
var privateKey = fs.readFileSync('../private/jwt.key','utf8');

export default privateKey;