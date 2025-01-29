const whiteList = ["http://127.0.0.1:5500","http://www.google.com",]

const corsOption = {
    origin: (origin, callback)=>{
        if (whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true)
        }
        else {
            callback(new Error("Not allowed by cors"))
        }
    },
    optionSuccessStatus: 200 

}

