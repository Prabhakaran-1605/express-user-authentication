const usersDb = {
    users : require("../model/users.json"),
    setUsers : function(data){
        return this.users = data
    }
}

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const fsPromises = require("fs").promises
const path = require("path")

const handleLogin = async (req,res) => {

    const {user,pwd} = req.body;
    if (!user || ! pwd) return res.status(400).json({"message" : "Username and password are required"})

        const foundUser = usersDb.users.find( person => person.userName === user)

        if (!foundUser) return res.sendStatus(401);   //unauthorized

        // evaluate password
        
        const match = await bcrypt.compare(pwd, foundUser.password)

        console.log(match,"match")

        if (match) {

        // create JWT's


        // 

        // To create accessToken
        // Type node in terminal and then give below comment in the terminal to introduce a accesstoken and then copy it in the .env file.
        // require("crypto").randomBytes(64).toString("hex")
            const accessToken = jwt.sign(
                { "userName" : foundUser.userName },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: "30s"}
            )

        // To create refreshToken
        // Type node in terminal and then give below comment in the terminal to introduce a accesstoken and then copy it in the .env file.
        // require("crypto").randomBytes(64).toString("hex")
            const refreshToken = jwt.sign(
                { "userName": foundUser.userName},
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: "1d"}
            )


            // Saving refreshToken with current user

            const otherUsers = usersDb.users.filter(person => person.userName !== foundUser)
            const currentUser= {...foundUser,refreshToken}


            usersDb.setUsers([...otherUsers,currentUser]);

            await fsPromises.writeFile(
                path.join(__dirname,"..","model","users.json"),
                JSON.stringify(usersDb.users)
            )

            res.cookie("jwt",refreshToken,{ httpOnly: true, maxAge: 24 * 60 * 60 * 1000})  //httpOnly not accessible to javascript

            res.json({ accessToken })
        } else {
            res.sendStatus(401) // unauthorized
        }
}

module.exports = { handleLogin }