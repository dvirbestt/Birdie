const express = require('express')
const router = express.Router();
const permissions = require('../Middleware/Permmissions')
const Jwt = require('jsonwebtoken');
const Post = require("../Models/Post")

router.post("/addPost",permissions("USER"),(req, res, next)=> {

    const token = req.headers.authorization;
    const user = Jwt.decode(token.substring(7)).user
    const post = req.body.post;

    Post.create({ownerName : user.userName, content : post.content}).then((post)=>{
        res.status(200).json({message : "Post Uploaded Successfully"});
    }).catch((e)=> {
        res.status(400).json({message : "Post Couldn't Been Uploaded "});
    })

})

router.post("/like",permissions("USER"),async (req, res)=> {
    let token = req.headers.authorization;
    let user = Jwt.decode(token.substring(7)).user

    let postId = req.body.post._id;

    let post = (await Post.find({_id: postId}).exec())[0];
    if (post){
        const alreadyLiked = post.likes.indexOf(user._id);

        if (alreadyLiked === -1){
            post.likes.push(user._id)
            Post.findOneAndUpdate({_id: post._id},post).then((file)=> {
                res.status(200).json({message: "You Liked This Post"})
            })

        }else {
            res.status(400).json({message: "You Already Liked that post"})
        }
    }else {
        res.status(404).json({message: "Couldn't Find the post "})
    }



})


module.exports = router;