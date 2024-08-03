const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const watchlater = require('../model/watchlater');


router.post('/create',(req,res)=>{
    const watchlaterobj = new watchlater({
        _id: new mongoose.Types.ObjectId(),
        userid:req.body.userid,
        videoid:req.body.videoid,
        tittle:req.body.tittle,
        description:req.body.description,
        video:req.body.video,
        thumbnail:req.body.thumbnail
    });

    watchlaterobj.save().then(result=>{
        return res.status(201).json({
            message:"Watchlater Added Successfully",
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
    
    watchlater.find({userid:req.params.userid}).exec().then(result=>{
        res.status(201).json({
            message:"get watchlater Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});




// router.get('/hview/:userid',(req,res)=>{
//     const page = parseInt(req.query.page);
//     const limit = parseInt(req.query.limit);
//     const startIndex = (page - 1)*limit
//     const endIndex = page*limit
//     const results = {}

//     if (endIndex < watchlater.length) {
        
//     }
//     results.next = {
//         page : page + 1,
//         limit : limit
//     }

//     if (startIndex>0) {
//         results.previous = {
//             page : page -1,
//             limit:limit
//         }    
//     }
    
//     history.find({userid:req.params.userid}).limit(limit).skip(startIndex).exec().then(result=>{
//         res.status(201).json({
//             message:"get watchlater Successfully",
//             result:result
//         })
//         }).catch(err=>{
//             res.status(500).json({
//                 message:"Something Went Wrong",
//                 error:err
//             })
//     })
// });

router.delete('/delete/:videoId/:userId',(req,res)=>{
    watchlater.remove({videoid:req.params.videoId}).or({userid:req.params.userId}).exec().then(result=>{
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