const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const slugify = require('slugify');
const taleemcategory = require("../model/taleemcategory");


router.post('/create',(req,res,next)=>{
    const taleemcategoryobj = new taleemcategory({
        _id: new mongoose.Types.ObjectId(),
        taleemcategoryname:req.body.taleemcategoryname,
        slug:slugify(req.body.taleemcategoryname)
    });
 
    taleemcategoryobj.save().then(result=>{
        return res.status(201).json({
            message:"create taleemCategory Successfully",
            category:result
        })
    }).catch(err=>{
        return res.status(500).json({
            message:"Something Went Wrong"
        })
    })
 });


 router.get('/view',(req,res)=>{
    taleemcategory.find().exec().then(result=>{
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

router.get("/:id",(req,res)=>{
    taleemcategory.find({_id:req.params.id}).exec().then(result=>{
        res.status(201).json({
            message:"get taleemcategory Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
});

router.patch("/update/:id",async(req,res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        const options = {new :true}

        const result = await taleemcategory.findByIdAndUpdate(id,
            updates,options);
            res.status(200).json({
                message:"user Updated Succesfully",
                result:result
            })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong"
        })
    }
});



router.delete('/deletecategory/:categoryId',(req,res)=>{
    taleemcategory.remove({_id:req.params.categoryId}).exec().then(result=>{
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