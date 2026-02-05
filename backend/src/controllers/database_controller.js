const User = require("../../models/user");
const bcrypt = require("bcrypt");

async function userCreation(req, res){
    try {
        const request = req.body;
        res.status(200).json({info: request});
        console.log(request);
    } catch (error) {
        res.status(500).json({error: "Failed to create user"});
        console.log(error);
    }
}

async function userLogging(){
    try {

    } catch (error) {
        res.status(500).json({error: "Failed to authenticate"});
        console.log(error);
    }
}

module.exports = {userCreation, userLogging}