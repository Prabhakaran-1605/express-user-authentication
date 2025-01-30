const usersDb = {
    users : require("../model/users.json"),
    setUsers : function(data){
        return this.users = data
    }
}
const jwt = require("jsonwebtoken")
require("dotenv").config()

const handleRefreshToken = (req,res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(401)
        console.log(cookies.jwt)
    const refreshToken = cookies.jwt;
        const foundUser = usersDb.users.find( person => person.refreshToken === refreshToken)

        if (!foundUser) return res.sendStatus(403);   //forbidden

        // evaluate jwt
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, decoded )=> {
                        if (err  || foundUser.userName !== decoded.userName) return res.sendStatus(403)
                            const accessToken = jwt.sign(
                        {"userName" : decoded.userName},
                        process.env.ACCESS_TOKEN_SECRET,
                        { expiresIn : "30s"}
                        )
                        res.json({accessToken})
                }
            )

       
}

module.exports = { handleRefreshToken }