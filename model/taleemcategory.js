const mongoose = require("mongoose");

const taleemcategorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    taleemcategoryname:{type:String,required:true},
    slug:{type:String,required:true,unique:true},
    image:{type:String}
},{timestamps:true});

module.exports = mongoose.model('taleemCategory',taleemcategorySchema);