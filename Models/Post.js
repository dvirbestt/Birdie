const mongoose = require('mongoose');


const Post = mongoose.model("Post",{
    ownerName : String,
    content : {type :Object, required : true},
    timeCreated : {type : Date, default : Date.now()},
    likes : Array,
    comments : Array,
    tags : Array
})

module.exports = Post