const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const viewcount = require('../model/viewcount');



router.post('/create',(req,res)=>{
    const viewobj = new viewcount({
        _id: new mongoose.Types.ObjectId(),
        userid:req.body.userid,
        videoid:req.body.videoid,
        tittle:req.body.tittle,
        description:req.body.description,
        video:req.body.video,
        thumbnail:req.body.thumbnail
    });

    viewobj.save().then(result=>{
        return res.status(201).json({
            message:"View Added Successfully",
            result:result
        })
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    })
});


router.get('/viewcount/:videoid',(req,res)=>{
    viewcount.find({videoid:req.params.videoid}).countDocuments().then(result=>{
        res.status(201).json({
            message:"get viewcount Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});






module.exports = router;
