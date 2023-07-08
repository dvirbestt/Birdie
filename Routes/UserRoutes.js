const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const bcrypt = require('bcrypt');
const Jwt = require('jsonwebtoken');
const permissions = require('../Middleware/Permmissions')



router.post("/signUp",async (req, res, next)=> {


    const reqUser = req.body.user;
    const checkUserWithUsername = await User.findOne({userName : reqUser.userName}).exec();
    const checkUserWithEmail = await User.findOne({email : reqUser.email}).exec();

    if (checkUserWithUsername){
        res.status(400).json({message : "Username is already taken"})
    }else if (checkUserWithEmail){
        res.status(400).json({message : "Email is already taken"})
    }else {

          bcrypt.genSalt(10).then((salt)=> {
              bcrypt.hash(reqUser.password,salt).then(hash => {
                  reqUser.password = hash;

                  User.create(reqUser).then(() => {
                      res.status(200).json({message : "User Created Successfully"})
                  })
              })
          })
    }
});

router.post('/login', async (req, res) => {
    const loginData = req.body.user;


    const test = await User.findOne({userName : loginData.userName}).select("password verified").exec();


    if (test == null){
        res.status(400).json({message : "Wrong Username Or Password"})
        return
    }

    if (test.password !== undefined && test.verified){
        if (await bcrypt.compare(loginData.password,test.password)){
            const user = await User.findOne({userName : loginData.userName}).select("role email firstName lastName userName").exec();
            const token = await Jwt.sign({user},"secret",{expiresIn: "1h"});

            res.status(200).json({user : user, token: token});
        }else{
            res.status(400).json({message : "Wrong Username Or Password"})
        }
    }else if (test.password !== undefined && test.verified !== true){
        res.status(400).json({message : "Please verify email"})
    }
})




module.exports = router