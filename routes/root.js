const express = require("express")
const router = express.Router()
const path = require("path")


router.get("^/$|/index(.html)?",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","index.html"))
})

router.get("/new-page(.html)?",(req,res)=>{
    res.sendFile(path.join(__dirname,"..","views","new-page.html"))
})

router.get("/old-page(.html)?",(req,res)=>{
    res.redirect(301,"new-page.html")
})

router.get("/hello(.html)?",(req,res,next)=>{
    console.log("Client tried to get hello page information")
    next()
},(req,res)=>{
    res.send("Hi Hello friends")
})

module.exports = router