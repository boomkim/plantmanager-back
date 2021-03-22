var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var plantSchema = new Schema({
    plantname: { type:String, required:true },
    kind: { type:String },
    photo_url: { type:String },
    water: [Date]
});

module.exports = plantSchema;

