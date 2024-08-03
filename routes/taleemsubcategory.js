const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const taleemsubcategory = require('../model/taleemsubcategory');


router.post('/create',(req,res)=>{
    console.log(req.body)
    const taleemsubcategoryname = new taleemsubcategory({
        _id: new mongoose.Types.ObjectId(),
        taleemcategoryname:req.body.taleemcategoryname,
        taleemsubcategoryname:req.body.taleemsubcategoryname,
    });
    taleemsubcategoryname.save().then(result=>{
        return res.status(201).json({
            message:"create subcategory Successfully",
            result:result
        })
    }).catch(err=>{
        console.log(err)
        return res.status(500).json({
            message:"Something Went Wrong",
            error:err
        })
    })
});



router.get("/view/:taleemcategoryname",(req,res)=>{
    taleemsubcategory.find({taleemcategoryname:req.params.taleemcategoryname}).exec().then(result=>{
        res.status(201).json({
            message:"get taleemsubcategory Successfully",
            result:result
        })
        }).catch(err=>{
            res.status(500).json({
                message:"Something Went Wrong",
                error:err
            })
    })
})

router.get("/:id",(req,res)=>{
    taleemsubcategory.find({_id:req.params.id}).exec().then(result=>{
        res.status(201).json({
            message:"get taleemsubcategory Successfully",
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

        const result = await taleemsubcategory.findByIdAndUpdate(id,
            updates,options);
            res.status(200).json({
                message:"taleem subcategory Updated Succesfully",
                result:result
            })
    } catch (error) {
        res.status(500).json({
            message:"Something Went Wrong"
        })
    }
});

router.delete('/deletesubcategory/:categoryId',(req,res)=>{
    taleemsubcategory.remove({_id:req.params.categoryId}).exec().then(result=>{
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