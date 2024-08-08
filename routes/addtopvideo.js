const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const topVideo = require('../model/addtopvideo');
const shortslike = require('../model/shortslike');
const multer = require('multer');
const path = require('path');
const { getvideoduration } = require('get-video-duration');
const mt = require('media-thumbnail');
// var ffmpeg = require('ffmpeg'); 
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg')
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
// const ffmpegPath = require('ffmpeg-static').path
const ffprobePath = require('ffprobe-static').path

ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'topuploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, `${Date.now()}_${file.originalname}`)
  }, fileFilter(req, file, cb) {
    const ext = path.extname = path.extname(file.originalname);
    if (ext !== '.mp4') {
      return cb(res.status(400).end('only mp4 are selected'), false);
    }
    cb(null, true)
  }
});
const upload = multer({ storage: storage });

//   router.post('/create',upload.single('topvideo'),(req,res)=>{
//       console.log("../topuploads/"+req.file.path.substring(11));
//       console.log('../topuploads/'+`${Date.now()}_${req.file.originalname.split('.mp4')}`+'thumb.png');
//     mt.forVideo(
//         './topuploads/'+req.file.path.substring(11),
//         './topuploads/'+req.file.path.substring(11).split('.mp4')+'thumb.png',
//         {width:1080,height:1920})
//         .then(() => console.log('Success'), err => console.error(err))

//         try { 

//             var process = new ffmpeg('./topuploads/'+req.file.path.substring(11)); 

//             process.then(function (video) { 

//                 console.log('The video is ready to be processed'); 

//                 var watermarkPath = './topuploads/watermark.png', 
//                 newFilepath = './topuploads/'+req.file.path.substring(11).split('.mp4')+'-watermark.mp4', 

//                 settings = { 
//                     position : "NW" // Position: NE NC NW SE SC SW C CE CW 
//                         , margin_nord : 10 // Margin nord 
//                         , margin_sud : null // Margin sud 
//                         , margin_east : null // Margin east 
//                         , margin_west : 10 // Margin west 
//                 }; 

//                 var callback = function (error, files) { 
//                     if(error){ 
//                         console.log('ERROR: ', error); 
//                     } 
//                     else{ 
//                         fs.unlinkSync('./topuploads/'+req.file.path.substring(11));
//                         console.log('TERMINOU', files); 
//                         const videoobj = new topVideo({
//                             _id: new mongoose.Types.ObjectId(),
//                             userid:req.body.userid,
//                             soundid:req.body.soundid,
//                             username:req.body.username,
//                             tittle:req.body.tittle,
//                             description:req.body.description,
//                             video:'topuploads/'+req.file.path.substring(11).split('.mp4')+'-watermark.mp4',
//                             thumbnail:'topuploads/'+req.file.path.substring(11).split('.mp4')+'thumb.png'
//                         });

//                         videoobj.save().then(result=>{
//                             return res.status(201).json({
//                                 message:"Upload Video Successfully",
//                                 result:result
//                             })
//                         }).catch(err=>{
//                             return res.status(500).json({
//                                 message:"Something Went Wrong",
//                                 error:err
//                             })
//                         })
//                     } 
//                 } 

//                 //add watermark 
//                 video.fnAddWatermark(watermarkPath, newFilepath, settings, callback) 

//             }, function (err) { 
//                 console.log('Error: ' + err); 
//             }); 
//            } catch (e) { 
//                 console.log(e.code); 
//                 console.log(e.msg); 
//            } 
// });



// router.post('/create', upload.single('topvideo'), (req, res) => {
//   mt.forVideo(
//     './topuploads/' + req.file.path.substring(11),
//     './topuploads/' + req.file.path.substring(11).split('.mp4') + 'thumb.png', { width: 1080, height: 1920 })
//     .then(() => console.log('Success'), err => console.error(err));

//   compress('topuploads/' + req.file.path.substring(11).split('.mp4') + 'compress.mp4', req.file.path).then(data => {
//     fs.unlinkSync(req.file.path);
//     const videoobj = new topVideo({
//       _id: new mongoose.Types.ObjectId(),
//       userid: req.body.userid,
//       soundid: req.body.soundid,
//       username: req.body?.username || "user",
//       tittle: req.body?.tittle || "hy",
//       description: req.body.description,
//       video: 'topuploads/' + req.file.path.substring(11).split('.mp4') + 'compress.mp4',
//       thumbnail: 'topuploads/' + req.file.path.substring(11).split('.mp4') + 'thumb.png',
//       publish: req.body.publish
//     });

//     videoobj.save().then(result => {
//       return res.status(201).json({
//         message: "Upload Video Successfully",
//         result: result,
//       })
//     }).catch(err => {
//       console.log("ccccccc" , err)
//       return res.status(500).json({
//         message: "Something Went Wrong",
//         error: err
//       })
//     })
//   }).catch(err => {
//     console.log("ttttt" , err)
//     return res.status(500).json({
//       message: "Something Went Wrong",
//       error: err
//     })
//   });
// });

router.post('/create', upload.single('topvideo'), async (req, res) => {
  try {
    // Construct file paths
    const filePath = req.file.path;
    const fileName = path.basename(filePath); // Extract the file name
    const thumbPath = path.join('./topuploads', `${fileName.split('.mp4')[0]}thumb.png`);
    const compressPath = path.join('./topuploads', `${fileName.split('.mp4')[0]}compress.mp4`);

    // Generate thumbnail
    mt.forVideo(filePath, thumbPath, { width: 1080, height: 1920, loglevel: 'debug' })
      .then(() => console.log('Success'))
      .catch(err => console.error('Error:', err));
    console.log('Thumbnail generated successfully');

    // Compress video
    await compress(compressPath, filePath);
    console.log('Video compressed successfully');

    // Remove the original file
    fs.unlinkSync(filePath);

    // Create video object and save to database
    const videoobj = new topVideo({
      _id: new mongoose.Types.ObjectId(),
      userid: req.body.userid,
      soundid: req.body.soundid,
      username: req.body?.username || "user",
      tittle: req.body?.tittle || "hy",
      description: req.body.description,
      video: compressPath,
      thumbnail: thumbPath,
      publish: req.body.publish
    });

    const result = await videoobj.save();
    return res.status(201).json({
      message: "Upload Video Successfully",
      result: result,
    });

  } catch (err) {
    console.log("Error occurred:", err);
    return res.status(500).json({
      message: "Something Went Wrong",
      error: err
    });
  }
});




function metadata(path) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(path, (err, metadata) => {
      if (err) {
        reject(err)
      }
      resolve(metadata)
    })
  })
}

async function compress(outputPath, videoPath) {
  const inputMetadata = await metadata(videoPath)
  const bitrate = whatBitrate(inputMetadata.format.size)
  await command(videoPath, outputPath, bitrate)
  const outputMetadata = await metadata(outputPath)

  return { outputPath }
}

function whatBitrate(bytes) {
  const ONE_MB = 188888
  const BIT = 30 // i found that 28 are good point fell free to change it as you feel right
  const diff = Math.floor(bytes / ONE_MB)
  if (diff < 5) {
    return 128
  } else {
    return Math.floor(diff * BIT * 1.1)
  }
}



// "[0:v]scale=140:-1[bg];[bg][1:v]overlay=W-w-10:H-h-10"

// "[1]colorchannelmixer=aa=0.8,scale=iw*0.8:-1[a];[0][a]overlay=x='if(lt(mod(t\,16)\,8)\,W-w-W*10/100\,W*10/100)':y='if(lt(mod(t+4\,16)\,8)\,H-h-H*5/100\,H*5/100)'"

function command(input, output, bitrate) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .input("./topuploads/watermark.png").complexFilter([
        "overlay='x=if(eq(mod(n\\,18)\\,0)\\,sin(random(1))*w\\,x):y=if(eq(mod(n\\,18)\\,0)\\,sin(random(1))*h\\,y)'",
      ])
      .outputOptions(['-c:v libx264', `-b:v ${bitrate}k`, '-c:a aac', '-b:a 100k'])
      .output(output)
      .on('start', (command) => {
        console.log('TCL: command -> command', command)
      })
      .on('error', (error) => reject(error))
      .on('end', () => resolve())
      .run()
  })
}


router.get('/view', async (req, res) => {
  try {
    const videos = await topVideo.find();
    await topVideo.find({ publish: true }).populate('userid').exec().then(result => {
      res.status(201).json({
        message: "get all Video Successfully",
        result: videos
      })
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: "Something Went Wrong",
      error: error
    })
  }
});

// http://192.168.29.184:5000
router.get('/view2', async (req, res) => {
  try {
    await topVideo.find({ publish: true }).populate('userid').exec().then(result => {
      // i(result);
      // console.log(i(result));
      // result.map((V)=>{
      //   na2(V._id);
      // });
      // console.log({$size:{shortslike}});
      res.status(201).json({
        message: "get all Video Successfully",
        result: result,
      })
    })
  } catch (error) {
    res.status(500).json({
      message: "Something Went Wrong",
      error: error
    })
  }
});

function na2(id) {
  shortslike.find({ videoid: id }).countDocuments().then(result2 => {
    return result2;
  }).then(data2 => {
    console.log(data2);
  }).catch(err2 => {
    console.log(err2);
  });
}

// function i(v){
//     return await 
//     v.map((v)=>{
//       r(v._id);
//     })
// }

// async function r(id){
//   await shortslike.find({videoid:id}).countDocuments().then(result=>{
//     return result;
//     }).catch(err=>{
//         return err;
// })
// }



router.get('/likecount/:videoid', (req, res) => {
  shortslike.find({ videoid: req.params.videoid }).countDocuments().then(result => {
    res.status(201).json({
      message: "get likecount Successfully",
      result: result
    })
  }).catch(err => {
    res.status(500).json({
      message: "Something Went Wrong",
      error: err
    })
  })
});


router.delete('/delete/:topvideoId', (req, res) => {
  topVideo.findByIdAndDelete({ _id: req.params.topvideoId }).exec().then(result => {
    console.log(result);
    fs.unlink(result.video, (err) => {
      console.log(err);
    });
    fs.unlinkSync("./" + result.thumbnail);
    res.status(200).json({
      message: "Video deleted Successfully",
    });
  }).catch(err => {
    res.status(500).json({
      error: err
    })
  })
});

module.exports = router;
