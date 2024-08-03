const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Video = require('../model/addvideo');
const multer  = require('multer');
const fs = require('fs');
const path = require('path');
const {getvideoduration} = require('get-video-duration');
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpegPath = require('ffmpeg-static').path
const ffprobePath = require('ffprobe-static').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads')
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
    name: 'video', maxCount: 1
  }, {
    name: 'thumbnail', maxCount: 1 ,
}]),(req,res)=>{
    let vpath;
    let tpath;
    let videof = req.files.video;
    
    let thumnailf = req.files.thumbnail;
    thumnailf.map((v,index)=>{
        tpath=v.path;
    });
    videof.map((v,index)=>{
        vpath=v.path;
    });

    compress('uploads/'+vpath.substring(8).split('.mp4')+'compress.mp4',vpath).then(data=>{
        fs.unlinkSync(vpath);
        const videoobj = new Video({
            _id: new mongoose.Types.ObjectId(),
            category:req.body.category,
            tittle:req.body.tittle,
            description:req.body.description,
            video:'uploads/'+vpath.substring(8).split('.mp4')+'compress.mp4',vpath,
            likecount:req.body.likecount,
            viewcount:req.body.viewcount,
            dislikecount:req.body.dislikecount,
            duration:req.body.duration,
            thumbnail:tpath
        });
    
        videoobj.save().then(result=>{
            return res.status(201).json({
                message:"Upload Video Successfully",
                result:result
            })
        }).catch(err=>{
            return res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
        })  
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    })
});

async function compress (outputPath,videoPath) {
    const inputMetadata = await metadata(videoPath)
    const bitrate = whatBitrate(inputMetadata.format.size)
    await command(videoPath, outputPath, bitrate)
    const outputMetadata = await metadata(outputPath)
  
    return {outputPath}
  }
  
  function metadata (path) {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(path, (err, metadata) => {
        if (err) {
          reject(err)
        }
        resolve(metadata)
      })
    })
  }
  
  function whatBitrate (bytes) {
    const ONE_MB = 2000000
    const BIT = 30 // i found that 28 are good point fell free to change it as you feel right
    const diff = Math.floor(bytes / ONE_MB)
    if (diff < 5) {
      return 528
    } else {
      return Math.floor(diff * BIT * 1.1)
    }
  }

  function command(input, output){
      ffmpeg(input).outputOptions('scale=486:-1')
  }
  
  function command (input, output, bitrate) {
    return new Promise((resolve, reject) => {
      ffmpeg(input).input("./topuploads/watermark.png").complexFilter([
         "overlay=10:10"
        ])
        .outputOptions(['-c:v libx264', `-b:v ${bitrate}k`, '-c:a aac', '-b:a 64k'])
        .output(output)
        .on('start', (command) => {
          console.log('TCL: command -> command', command)
        })
        .on('error', (error) => reject(error))
        .on('end', () => resolve())
        .run()
    })
  }

router.post('/uploadvideo',(req,res)=>{
    
    return res.status(200).json({
        msg:"true",
        videopath:vpath,
        thumbnailpath:tpath
    })
})



router.get('/view',async(req,res)=>{
    await Video.find().exec().then(result=>{
        res.status(201).json({
            message: "get all video Successfully",
            result: result,
            // likes: likevideo
        })
        }).catch(err=>{
            console.log(err)
         res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/mview',async(req,res)=>{
    console.log("=================")
// return res.send('hyyyyyyyyyy')
    try {
        const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1)*limit
    const endIndex = page*limit
    const results = {}

    if (endIndex < Video.length) {
        
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
    
    Video.find().limit(limit).skip(startIndex).exec().then(result=>{
        res.status(201).json({
            message:"get all video Successfully",
            result:result
        })
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    }
});

router.get('/mview/:category',async (req,res)=>{
    try {
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1)*limit
    const endIndex = page*limit
    const results = {}

    if (endIndex < Video.length) {
        
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
    
    Video.find({category:req.params.category}).limit(limit).skip(startIndex).exec().then(result=>{
        res.status(201).json({
            message:"get all video Successfully",
            result:result
        })
        })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    }
});


router.delete('/delete/:videoId',async(req,res)=>{
    await Video.findByIdAndDelete({_id:req.params.videoId}).exec().then(result=>{
        console.log("./"+result.thumbnail.toString());
        fs.unlink('./'+result.video,(err)=>{
            if (err) {
                console.log(err);   
            } else {
            
            }
        });
        res.status(200).json({
            message:"Video deleted Successfully",
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

router.get('/view/:videoId',(req,res)=>{
    Video.find({_id:req.params.videoId}).exec().then(result=>{
        console.log(result);
        console.log(path.join(__dirname+"/"+result[0].video));
        res.status(200).json({
            message:"video fetch successfully",
            result:result
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});

router.get('/search',(req,res)=>{
    const searchfield = req.query.tittle;
    Video.find({description:{$regex:searchfield,$options:'$i'}}).then(data=>{
        res.status(200).json({
            message:"get search successfully",
            result:data
        });
    })
});



module.exports = router;