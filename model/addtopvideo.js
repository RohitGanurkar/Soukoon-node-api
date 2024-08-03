const mongoose = require("mongoose");

const addtopvideoSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userid:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    soundid:{type:mongoose.Schema.Types.ObjectId,ref:'Sound'},
    username:{type:String,required:true},
    tittle:{type:String,required:true,trim:'true'},
    description:{type:String,required:true,trim:true},
    video:{type:String,required:true},
    thumbnail:{type:String},
    publish:{type:String}
},{timestamps:true});

module.exports = mongoose.model('topVideo',addtopvideoSchema);