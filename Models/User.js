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
    }
})

module.exports = User;