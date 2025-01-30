const express = require("express")
const app = express()
const path = require("path")
const {logger} = require("./middleWare/logEvents")
const errorHandler = require("./middleWare/errorHandler")
const cors = require("cors")
const corsOption = require("./config/corsOption")
const PORT = process.env.PORT || 3502
const verifyJWT = require("./middleWare/verifyJWT")
const cookieParser = require("cookie-parser")


// custom middleware logger
app.use(logger);

// cross origin resource sharing
app.use(cors(corsOption));


// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended:false}));

// built-in middleware for json 
app.use(express.json());

// middleware for cookies
app.use(cookieParser());

app.use("/",express.static(path.join(__dirname,"./public")))
app.use("/subdir",express.static(path.join(__dirname,"./public")))

app.use("/",require("./routes/root"))
app.use("/register", require("./routes/register"))
app.use("/login",require("./routes/auth"))
app.use("/refresh",require("./routes/refresh"))
app.use("/logout",require("./routes/logout"))
app.use(verifyJWT)
app.use("/subdir",require("./routes/subdir"))    // you can give any name in subdir
app.use("/employees",require("./routes/api/employees"))

// chain function 

const one = (req,res,next)=>{
    console.log("one")
    next()
}

const two = (req,res,next)=>{
console.log("two")
next()
}

const three = (req,res) =>{
res.send("Finished!")
}

app.get("/chain(.html)?",[one, two, three]) 

app.get("/*",(req,res)=>{
    res.status(404).sendFile(path.join(__dirname,"views","404.html"))
})

app.all("*",(req,res)=>{
    res.status(404);
    if(req.accepts("html")){
        res.sendFile(path.join(__dirname,"views","404.html"));
    }
    else if (req.accepts("json")){
        res.json({error : "404 not found"})
    }
    else {
        res.type("txt").send("404 not found")
    }

})

app.use(errorHandler)

app.listen(PORT,()=>{
    console.log(`Server is running on Port :${PORT}`)
})
