const mongoose = require("mongoose");

const taleemsubcategory = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taleemcategoryname:{type:String, ref:'taleemCategory',required:true},
    taleemsubcategoryname:{type:String,required:true,trim:'true'},
},{timestamps:true});

module.exports = mongoose.model('taleemsubcategory',taleemsubcategory);