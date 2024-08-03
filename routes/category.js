const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const slugify = require('slugify');
const category = require("../model/category");


router.post('/create',(req,res,next)=>{
   const categoryobj = new category({
       _id: new mongoose.Types.ObjectId(),
       categoryname:req.body.categoryname,
       slug:slugify(req.body.categoryname)
   });

   categoryobj.save().then(result=>{
       return res.status(201).json({
           message:"create Category Successfully",
           category:result
       })
   }).catch(err=>{
       return res.status(500).json({
           message:"Something Went Wrong"
       })
   })
});

router.get('/view',(req,res)=>{
    category.find().exec().then(result=>{
        res.status(201).json({
            message:"get all Category Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.delete('/deletecategory/:categoryId',(req,res)=>{
    category.remove({_id:req.params.categoryId}).exec().then(result=>{
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