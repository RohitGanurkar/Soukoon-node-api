const mongoose = require("mongoose");

const watchlaterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    userid:{type:String, ref:'User',required:true},
    videoid:{type:String, ref:'Video',required:true},
    tittle:{type:String,required:true,trim:'true'},
    description:{type:String,required:true,trim:true},
    video:{type:String,required:true},
    thumbnail:{type:String,required:true}
},{timestamps:true});

module.exports = mongoose.model('Watchhlater',watchlaterSchema);