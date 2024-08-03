const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const likevideo = require('../model/userfollow');
const User = require('../model/user');


router.post('/create',(req,res)=>{
    const likevideoobj = new likevideo({
        _id: new mongoose.Types.ObjectId(),
        userid:req.body.userid,
        profileid:req.body.profileid
    });
    likevideoobj.save().then(result=>{
        userfind(result.profileid,result.userid);
            return res.status(201).json({
            message:"Follow User Successfully",
            result:result
        })
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    });
})


router.get('/view/:userid',(req,res)=>{
    
    likevideo.find({userid:req.params.userid}).populate('videoid').exec().then(result=>{
        res.status(201).json({
            message:"get follow User Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/followingcount/:userid',(req,res)=>{
    likevideo.find({userid:req.params.userid}).countDocuments().then(result=>{
        res.status(201).json({
            message:"get Follower Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/followercount/:profileid',(req,res)=>{
    likevideo.find({profileid:req.params.profileid}).countDocuments().then(result=>{
        res.status(201).json({
            message:"get Follower Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.get('/followed/:profileid/:userid',(req,res)=>{
    likevideo.find({profileid:req.params.profileid}).or({userid:req.params.userid}).exec().then(result=>{
        res.status(201).json({
            message:"Followed",
            result:result
        })
        }).catch(err=>{
            res.status(201).json({
                message:"not Followed",
            })
    })
});


router.get('/followerview/:userid',(req,res)=>{
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
    
    likevideo.find({userid:req.params.userid}).populate('userid').limit(limit).skip(startIndex).exec().then(result=>{
        res.status(201).json({
            message:"get Follow Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});


router.get('/followingview/:profileid',(req,res)=>{
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
    
    likevideo.find({profileid:req.params.profileid}).populate('profileid').limit(limit).skip(startIndex).exec().then(result=>{
        res.status(201).json({
            message:"get Follow Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.delete('/delete/:profileId/:userId',(req,res)=>{
    likevideo.remove({profileid:req.params.profileId}).or({userid:req.params.userId}).exec().then(result=>{
        res.status(200).json({
            message:"UnFollow Successfully",
        });
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
});


var userfind = function(data,data2){
    User.find({_id:data}).exec().then(res=>{
        User.find({_id:data2}).exec().then(result=>{
            console.log(result[0].profilepic);
            var message = { 
                app_id: "6055d6cf-5606-487d-adb1-8aa63dc22da4",
                headings:{"en":"Sukoon"},
                contents: {"en":result[0].fullName+" is Follows You"},
                include_player_ids:["416febaa-adef-11ec-894a-aab09dbdda2c"],
                headings_color:"000",
                contents_color:"000",
                app_url:"",
                small_icon:"lll",
                big_picture:`http://sukoon734.com/api/${result[0].profilepic}`,
                large_icon:`http://sukoon734.com/api/${result[0].profilepic}`,
                android_accent_color:"fff",
                android_visibility:"1"
              };
              sendNotification(message);
        }).catch(err=>{
        })
    }).catch(err=>{
        console.log(err);
    });
}


var sendNotification = function(data) {
  var headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Authorization": "Basic OTYyNDNkZmItNzNjNS00ZGNkLWE4NWYtY2M5NmY0ODczODA1"
  };
  
  var options = {
    host: "onesignal.com",
    port: 443,
    path: "/api/v1/notifications",
    method: "POST",
    headers: headers
  };
  
  var https = require('https');
  var req = https.request(options, function(res) {  
    res.on('data', function(data) {
      console.log("Response:");
      console.log(JSON.parse(data));
    });
  });
  
  req.on('error', function(e) {
    console.log("ERROR:");
    console.log(e);
  });
  
  req.write(JSON.stringify(data));
  req.end();
};

module.exports = router;