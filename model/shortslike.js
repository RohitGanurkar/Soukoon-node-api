const mongoose = require("mongoose");

const shortslikeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    userid:{type:String, ref:'User',required:true},
    videoid:{type:String, ref:'Video',required:true,ref:'topVideo'}
},{timestamps:true});

module.exports = mongoose.model('shortslike',shortslikeSchema);