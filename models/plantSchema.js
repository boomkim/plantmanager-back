var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var plantSchema = new Schema({
    plant_id: Schema.Types.ObjectId,
    plantname: { type:String, required:true },
    kind: { type:String },
    photo_url: { type:String }
});

module.exports = plantSchema;

