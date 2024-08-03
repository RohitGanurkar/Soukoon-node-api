const express = require("express");
const mongoose = require("mongoose");
const taleemcontent = require("../model/taleemcontent");
const router = express.Router();
const multer  = require('multer');



const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'sukoonaudio')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, `${Date.now()}_${file.originalname}`)
    },fileFilter (req, file, cb) {
      const ext = path.extname = path.extname(file.originalname);
      if (ext!=='.mp4') {
          return cb(res.status(400).end('only mp4 are selected'),false);
      }
        cb(null, true)
    }
  })

const upload = multer({storage:storage});



router.post('/create',upload.fields([{
    name: 'taleemaudio', maxCount: 1
  }, {
    name: 'taleemaudioinenglish', maxCount: 1,
}]),(req,res)=>{
    let apath;
    let bpath;
    let videof = req.files.taleemaudio;
    videof.map((v,index)=>{
        apath=v.path;
    });

    let vof = req.files.taleemaudioinenglish;

    vof.map((v,index)=>{
        bpath=v.path;
    });

    const taleemcontentobj = new taleemcontent({
        _id: new mongoose.Types.ObjectId(),
        taleemsubcategoryname:req.body.taleemsubcategoryname,
        taleemcontent:req.body.taleemcontent,
        meaninginhindi:req.body.meaninginhindi,
        meaninginenglish:req.body.meaninginenglish,
        meaninginurdu:req.body.meaninginurdu,
        taleemaudio:apath,
        taleemaudioinenglish:bpath
    });

    taleemcontentobj.save().then(result=>{
        return res.status(201).json({
            message:"create content Successfully",
            result:result
        })
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    })
});

router.get("/view/:taleemsubcategoryname",(req,res)=>{
    taleemcontent.find({taleemsubcategoryname:req.params.taleemsubcategoryname}).exec().then(result=>{
        res.status(201).json({
            message:"get content Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get("/:id",(req,res)=>{
    taleemcontent.find({_id:req.params.id}).exec().then(result=>{
        res.status(201).json({
            message:"get taleemcontent Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});


router.delete('/deletecontent/:categoryId',(req,res)=>{
    taleemcontent.remove({_id:req.params.categoryId}).exec().then(result=>{
        res.status(200).json({
            message:"User deleted Successfully",
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})


module.exports = router;