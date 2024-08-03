const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const likevideo = require('../model/shortslike');


router.post('/create',(req,res)=>{
    const likevideoobj = new likevideo({
        _id: new mongoose.Types.ObjectId(),
        userid:req.body.userid,
        videoid:req.body.videoid
    });

    likevideoobj.save().then(result=>{
        return res.status(201).json({
            message:"like Added Successfully",
            result:result
        })
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    })
});


router.get('/view/:userid',(req,res)=>{
    
    likevideo.find({userid:req.params.userid}).populate('videoid').exec().then(result=>{
        res.status(201).json({
            message:"get likevideo Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/likecount/:videoid',(req,res)=>{
    likevideo.find({videoid:req.params.videoid}).countDocuments().then(result=>{
        res.status(201).json({
            message:"get likecount Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/liked/:videoid/:userid',(req,res)=>{
    likevideo.find({videoid:req.params.videoid}).or({userid:req.params.userid}).exec().then(result=>{
        res.status(201).json({
            message:"get likecount Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});


router.get('/hview/:userid',(req,res)=>{
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1)*limit
    const endIndex = page*limit
    const results = {}

    if (endIndex < likevideo.length) {
        
    }
    results.next = {
        page : page + 1,
        limit : limit
    }

    if (startIndex>0) {
        results.previous = {
            page : page -1,
            limit:limit
        }    
    }
    
    likevideo.find({userid:req.params.userid}).populate('videoid').limit(limit).skip(startIndex).exec().then(result=>{
        res.status(201).json({
            message:"get likevideo Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.delete('/delete/:videoId/:userId',(req,res)=>{
    likevideo.remove({videoid:req.params.videoId}).or({userid:req.params.userId}).exec().then(result=>{
        res.status(200).json({
            message:"like deleted Successfully",
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

module.exports = router;