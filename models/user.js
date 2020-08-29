var mongoose = require('mongoose');
var bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: { type:String, required: true},
    email: { type: String, unique: true, required: true},
    salt: { type: String },
    hash: { type: String, required: true },
    registered: { type: Date, default: Date.now, required: true}
});

userSchema.statics.findOneByEmail = function(email) { 
    return this.findOne({
        email
    }).exec()
}

userSchema.statics.findOneById = function(id) {
    return this.findOne({
        _id: id
    }).exec()
}

userSchema.methods.verify = function (password) {
    userHash = this.hash;
    opts = { password:password, salt: this.salt };
    return new Promise((resolve,reject) => {
        hasher(opts, function(err, pass, salt, hash) {
            resolve(userHash === hash);
        })
    });
};

module.exports = mongoose.model('user', userSchema);