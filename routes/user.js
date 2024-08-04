const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();


const User = require('../model/user');
const jwt = require("jsonwebtoken");



router.post("/Register", (req, res, next) => {
    try {

        console.log("req.body", req.body)
        User.find({ contact: req.body.contact }).exec().then(
            user => {
                if (user.length >= 1) {
                    return res.status(201).json({
                        message: "Mobile Number Is Already Exist"
                    });
                } else {
                    bcrypt.hash(req?.body?.password, 10, (err, hash) => {
                        // if (err) {
                        //     return res.status(500).json({
                        //         error: err
                        //     });
                        // } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId(),
                            fullName: req.body.fullName,
                            contact: req.body.contact,
                            password: hash,
                            dateofbirth: req.body.dateofbirth,
                            gender: req.body.gender,
                            profilepic: req.body.profilepic,
                            description: req.body.description
                        });
                        user.save().then(result => {
                            res.status(200).json({
                                message: "User Registered Succesfully",
                                user: result
                            });
                        }).catch(err => {
                            res.status(500).json({
                                error: err
                            });
                        })
                        // }
                    });
                }
            }
        )


    } catch (error) {
        console.log(error)
        res.json({ messgae: "Not", error })
    }
});


// router.post("/Register",(req,res,next)=>{
//     User.find({contact:req.body.contact}).exec().then(
//         user=>{
//             if(user.length >= 1){
//                 return res.status(200).json({
//                     message:"Mobile Number Is Already Exist"
//                 });
//             } else {
//                         const user =  new User({
//                             _id: new mongoose.Types.ObjectId(),
//                             fullName:req.body.fullName,
//                             contact:req.body.contact,
//                             dateofbirth:req.body.dateofbirth,
//                             gender:req.body.gender,
//                             profilepic:req.body.profilepic,
//                             description:req.body.description,
//                             lat:req.body.lat,
//                             lon:req.body.lon,
//                             location:req.body.location,
//                             onesignaluserid:req.body.onesignaluserid,
//                             onesignalpushtoken:req.body.onesignalpushtoken,
//                             firebasetoken:req.body.firebasetoken
//                         });
//                         user.save().then(result=>{
//                             res.status(200).json({
//                                 message:"User Registered Succesfully",
//                                 user:result
//                             });
//                         }).catch(err=>{
//                             res.status(500).json({
//                                 error:err
//                             });
//                         })
//                 };
//             }
//         )       
// });

// router.post("/verifyOtp",(req,res,next)=>{
//     User.find({contact:req.body.contact}).then(user=>{
//         if(user.length < 1){
//             return res.status(401).json({
//                 message:"Verification Failed"
//             });
//         } else {
//             if (req.body.otp==user[0].otp) {
//                 res.status(200).json({
//                     message:"Verification Successfull",
//                     result:user
//                 })
//             } else {
//                 res.status(500).json({
//                     message:"Verification Failed"
//                 })
//             }
//         }
//     })
// });

router.post("/Login", (req, res, next) => {
    User.find({ contact: req.body.contact }).then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Login Failed"
            });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if (err) {
                return res.status(401).json({
                    message: "Login Failed"
                });
            } else {
                if (result) {
                    const token = jwt.sign({
                        contact: user[0].contact,
                        userId: user[0]._id
                    }, process.env.jwtuser_key, {
                        expiresIn: "12h"
                    });
                    return res.status(200).json({
                        message: "Login Successfully",
                        result: user,
                        token: token
                    })
                }

            }
        })
    })
})

router.post("/Loginnew", (req, res, next) => {
    User.find({ contact: req.body.contact }).then(user => {
        if (user.length < 1) {
            return res.status(401).json({
                message: "Login Failed"
            });
        } else {
            const token = jwt.sign({
                contact: user[0].contact,
                userId: user[0]._id
            }, process.env.jwtuser_key, {
                expiresIn: "12h"
            });
            return res.status(200).json({
                message: "Login Successfully",
                result: user,
                token: token
            })
        }
    })
})

router.delete("/deleteuserbyId/:userId", (req, res, next) => {
    User.remove({ _id: req.params.userId }).exec().then(result => {
        return res.status(200).json({
            message: "User deleted Successfully",
        });
    }).catch(err => {
        return res.status(500).json({
            error: err
        })
    })
});


router.post('/delete-user', (req, res) => {
    const { userId } = req.body

    User.remove({ _id: userId }).exec().then(result => {
        return res.status(200).json({
            message: "User deleted Successfully",
        });
    }).catch(err => {
        return res.status(500).json({
            error: err
        })
    })

})

router.delete("/deleteuserbyNo/:usernumber", (req, res, next) => {
    User.remove({ contact: req.params.usernumber }).exec().then(result => {
        res.status(200).json({
            message: "User deleted Successfully",
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


router.patch('/forgetpassword/:userId', async (req, res, next) => {
    try {
        const contact = req.params.userId;
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);
        const options = { new: true }

        const result = await User.findOneAndUpdate({ contact: contact },
            { password: password }, options);
        res.status(200).json({
            message: "user Updated Succesfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
});

router.patch('/changepassword/:userId', async (req, res) => {
    try {
        let a1;
        const id = req.params.userId;
        const salt = await bcrypt.genSalt(10);
        const password = await bcrypt.hash(req.body.password, salt);

        const r = await User.findByIdAndUpdate({ _id: id });
        if (bcrypt.compareSync(req.body.currentpassword, r.password)) {
            r.password = password;
            a1 = await r.save();
            return res.status(200).json({
                message: "Password Change Successfully",
            });
        } else {
            return res.status(200).json({
                message: "Incorrect Password"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error
        })
    }
});


router.get("/userbyId/:userId", (req, res, next) => {
    User.find({ _id: req.params.userId }).exec().then(result => {
        res.status(200).json({
            message: "User Get Successfully",
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
});


router.get("/userbyNo/:usernumber", (req, res, next) => {
    User.find({ contact: req.params.usernumber }).exec().then(result => {
        res.status(200).json({
            message: "User Get Successfully",
            result: result
        });
    }).catch(err => {
        res.status(500).json({
            error: err
        })
    })
});

router.get("/allusers", (req, res, next) => {
    User.find().exec().then(result => {
        // User.find({ _id: result[1]._id }).exec().then(result => {
        //     console.log(result[0].fullName);
        // }).catch(err => {
        //     console.log(err);
        // })
        res.status(200).json({
            message: "All Users get Successfully",
            result: result
        });
    }).catch(err => {
        console.log(err)
        res.status(500).json({
            error: err
        })
    })
})


router.patch('/updateuser/:userId', async (req, res, next) => {
    try {
        const id = req.params.userId;
        const updates = req.body;
        const options = { new: true }

        const result = await User.findByIdAndUpdate(id,
            updates, options);
        res.status(200).json({
            message: "user Updated Succesfully",
            result: result
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
});

router.patch('/v2/updateuser/:userId', async (req, res, next) => {
    try {
        const id = req.params.userId;
        const updates = req.body;
        const options = { new: true }

        const result = await User.findByIdAndUpdate(id,
            updates, options);
        res.status(200).json({
            message: "user Updated Succesfully",
            result: result
        })
    } catch (error) {
        res.status(500).json({
            message: "Something Went Wrong"
        })
    }
});


// router.patch('/changepassword/:userId',async(req,res)=>{
//     try {
//         const salt = await bcrypt.genSalt(10);
//         const password = await bcrypt.hash(req.body.password,salt);
//         const r = await User.findByIdAndUpdate({_id:req.params.userId});
//            console.log(r.password);
//            bcrypt.compareSync(req.body.oldpassword,r.password,(err,same)=>{
//                if(err){
//                    res.status(401).json({
//                        message:"something went weong"
//                    })
//                } else if (same) {
//                 r.password = password;
//                 a1 = r.save();
//                 res.status(200).json({
//                     message:"password change Successfully"
//                 })
//                } else{
//                 res.status(401).json({
//                     message:"password are not Match"
//                 }) 
//                }
//            })   
//     } catch (error) {
//         res.status(500).json({
//                     message:error
//                 })
//     }
// })



// try{
//     const id = req.params.userId;
//     const salt = await bcrypt.genSalt(10);
//     const updates = req.body;
//     const password = await bcrypt.hash(req.body.password,salt);
//     const options = {new :true}
//     const resu = await User.findByIdAndUpdate(id,updates,options);
//    bcrypt.compare(req.body.oldpassword,resu.password,(err,result)=>{
//         if (err) {
//             return res.status(401).json({
//                 message:"Something Went Wrong"
//             });
//         } else {
//             if (result) {
//             resu.password=password;
//             const a1 = resu.save();
//                res.status(200).json({
//                     message:"Password Updated Succesfully",
//                     result:resu
//                 })
//             } else{
//                 return res.status(401).json({
//                     message:"Password Not Match"
//                 });
//             }
//         }
//     })
// }catch (error) {
//     res.status(500).json({
//         message:"Something Went Wrong",
//         err:error
//     })
// }



module.exports = router;