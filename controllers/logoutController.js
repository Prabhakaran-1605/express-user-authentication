const usersDb = {
    users : require("../model/users.json"),
    setUsers : function(data){
        return this.users = data
    }
}
const fsPromises = require("fs").promises
const path = require("path")

const handleLogout = async (req,res) => {
    //  on client , also delete the accessToken 

    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(204)  // No content to send back
    const refreshToken = cookies.jwt;

    // if refreshToken in DB?
        const foundUser = usersDb.users.find( person => person.refreshToken === refreshToken)

        if (!foundUser) {
                res.clearCookie("jwt", { httpOnly: true})
                return res.sendStatus(204);   //forbidden
            }
        // Delete refreshToken in db
        const otherUsers = usersDb.users.filter(person => person.refreshToken !== foundUser.refreshToken  )
       const currentUser = {...foundUser, refreshToken: ""};
       usersDb.setUsers([...otherUsers,currentUser])
    await fsPromises.writeFile(
        path.join(__dirname,"..","model","users.json" ),
        JSON.stringify(usersDb.users)
    )
    res.clearCookie("jwt", {httpOnly : true })   // secure - true only serves on https
    res.sendStatus(204)
}

module.exports = { handleLogout }