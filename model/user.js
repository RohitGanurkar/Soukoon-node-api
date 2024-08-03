const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    fullName:{type:String},
    contact:{type:String,required:true,unique:true},
    dateofbirth:{type:String},
    password:{type:String},
    lat:{type:String},
    lon:{type:String},
    location:{type:String},
    onesignaluserid:{type:String},
    onesignalpushtoken:{type:String},
    firebasetoken:{type:String},
    isprofilecomplete:{type:Boolean,default:false},
    gender:{type:String},
    description:{type:String},
    profilepic:{type:String,default :'null'}
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);
