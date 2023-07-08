const mongoose = require('mongoose');

const User = mongoose.model("user", {
    firstName : String,
    lastName : String,
    email : String,
    userName : String,
    password : String,
    role : {type : String, default: "USER"},
    verified : {
        type : Boolean,
        default : true
    },
    interests : Array,
    follows : Array,
    followers : Array,
    blocked : Array,
    blockedBy :Array
})

module.exports = User;