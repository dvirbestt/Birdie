const express = require('express')
const router = express.Router();
const permissions = require('../Middleware/Permmissions')
const Jwt = require('jsonwebtoken');
const Post = require("../Models/Post")
const mongoose = require("mongoose");
const {randomUUID} = require("crypto");

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
                Post.findOne({_id : post._id}).exec().then((file)=> {
                    res.status(200).json({message: "You Liked This Post", post: file})
                })

            })

        }else {
            res.status(400).json({message: "You Already Liked that post"})
        }
    }else {
        res.status(404).json({message: "Couldn't Find the post "})
    }
})


router.post("/comment",permissions("USER"),async (req, res) => {
    const token = req.headers.authorization.substring(7);
    let user = Jwt.decode(token).user;

    const postId = req.body.post._id;
    let post = (await Post.find({_id: postId}).exec())[0];

    if (post === null){
        res.status(404).json({message : "Post does not exist"});
        return
    }

    post.comments.push({
        _id: randomUUID(),
        content : req.body.post.comment,
        ownerId : user._id,
        ownerUserName : user.userName,
        timeStamp : Date.now()});

    Post.findOneAndUpdate({_id: post._id},post).then(()=> {
        res.status(200).json({message: "You Commented On this post"})
    })
});

router.post("/unlike",permissions("USER"),async (req, res)=> {
    const token = req.headers.authorization.substring(7);
    const user = Jwt.decode(token).user;


    const post = await Post.findOne({_id:req.body.post._id}).exec();

    let indexOfLike = post.likes.indexOf(user._id);

    if (indexOfLike !== -1){
        post.likes.splice(indexOfLike,1);
        Post.findOneAndUpdate({_id: post._id},post).exec().then(()=> {
            Post.findOne({_id : post._id}).exec().then((file)=> {
                res.status(200).json({message: "You unliked that post", post: file})
            })
        })
    }else {
        res.status(400).json({message : "couldn't remove the like"})
    }

});


router.delete("/deleteComment",permissions("USER"),async (req ,res) => {
    const token = req.headers.authorization.substring(7);
    const user = Jwt.decode(token).user;
    let post = await Post.findOne({_id: req.body.post._id}).exec()

    let theComment = post.comments.filter((comment)=> comment._id === req.body.post.commentId)[0];


    if (user.role === "ADMIN" && post){
        post.comments = post.comments.filter((comment)=> comment._id !== theComment._id)
        Post.findOneAndUpdate({_id: post._id},post).exec();
        res.status(200).json({message : "Comment deleted successfully"})
        return
    }else if(user._id === theComment.ownerId || user.userName === post.ownerName ){
        post.comments = post.comments.filter((comment)=> comment._id !== theComment._id);
        Post.findOneAndUpdate({_id: post._id},post).exec();
        res.status(200).json({message : "Comment deleted successfully"})
        return
    }
    res.status(400).json({message : "Couldn't delete Comment"})

});


router.delete("/deletePost",permissions("USER"),async (req,res)=> {
    const token = req.headers.authorization.substring(7);
    const user = Jwt.decode(token).user;
    let post= await Post.findOne({_id : req.body.post._id}).exec();

    if (user.role === "ADMIN" || user.userName === post.ownerName){
        Post.findByIdAndDelete({_id: post._id}).exec().then(()=> {
            res.status(200).json({message : "Post deleted successfully"});
        })
    }else {
        res.status(400).json({message : "You Cant Delete that Post"});
    }

})


router.post("/getPosts",permissions("USER"), async (req, res) => {
    const token = req.headers.authorization.substring(7);
    const user = Jwt.decode(token).user;
    const data = await Post.find();
    res.status(200).json({data});
})


router.post("/getPost",permissions("GUEST"),async (req,res)=> {
    const post = await Post.find({_id: req.body.post._id});
    res.status(200).json({post})
})


module.exports = router;