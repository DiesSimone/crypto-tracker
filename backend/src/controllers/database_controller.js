const User = require("../../models/user");

async function userCreation(req, res){
    try {
        User.create({
        _id: 1,
        username: "Simone",
        email: "simoneraja06@gmail.com",
        password: "admin",
        created_at: new Date(Date.now())
        });
        res.status(200).json({info: "Created new user"});
    } catch (error) {
        res.status(500).json({error: "Failed to create user"});
        console.log(error);
    }
}

module.exports = {userCreation}