const mongoose = require("mongoose");

const addvideoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    tittle:{type:String,required:true,trim:'true'},
    description:{type:String,required:true,trim:true},
    duration:{type:String},
    dislikecount:{type:Number},
    viewcount:{type:Number,ref:'viewcount'},
    likecount:{type:Number},
    video:{type:String,required:true},
    thumbnail:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Video',addvideoSchema);



// mongoose.Schema.Types.ObjectId