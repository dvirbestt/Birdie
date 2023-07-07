const express = require('express');
const app = express();
const mongoose = require('mongoose');
const UserRoutes = require("./Routes/UserRoutes")
const PostRoutes = require("./Routes/PostRoutes")
const bodyParser = require('body-parser')

mongoose.connect("mongodb://127.0.0.1:27017/Birdie").then(()=>{
    console.log("Connected To MongoDB");
})

app.use(bodyParser.urlencoded({extended : false}))
app.use(bodyParser.json())

app.use((req,res,next)=> {
    res.header('Access-Control-Allow-Origin',"*");
    res.header('Access-Control-Allow-Headers',"*");
    if (req.method === "OPTIONS"){
        res.header('Access-Control-Allow-Methods',"PUT,GET,POST,DELETE,PATCH");
        res.status(200).json({})
    }
    next();
})


app.use("/users",UserRoutes)
app.use("/Posts",PostRoutes)



module.exports = app;