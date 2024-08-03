const mongoose = require("mongoose");

const userfollowSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    userid:{type:String, ref:'User',required:true},
    profileid:{type:String, ref:'User',required:true}
},{timestamps:true});

module.exports = mongoose.model('userfollow',userfollowSchema);