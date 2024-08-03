const mongoose = require("mongoose");

const taleemcontent = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, 
    taleemsubcategoryname:{type:String, ref:'taleemsubcategory',required:true},
    taleemcontent:{type:String,required:true,trim:'true'},
    meaninginhindi:{type:String},
    meaninginenglish:{type:String},
    meaninginurdu:{type:String},
    taleemaudio:{type:String},
    taleemaudioinenglish:{type:String}
},{timestamps:true});

module.exports = mongoose.model('taleemcontent',taleemcontent);