const User = require("../../models/user");
const bcrypt = require("bcrypt");

async function userCreation(req, res) {
    try {
        const hashedPwd = await bcrypt.hash(req.body.password, 10);
        User.create({
            username: req.body.username,
            email: "test@example.com",
            password: hashedPwd,
            created_at: new Date(Date.now())
        });
        res.status(200).json({ info: req.body });
    } catch (error) {
        res.status(500).json({ error: "Failed to create user" });
        console.log(error);
    }
}

async function userLogging(req, res) {
    const user = await User.findOne({ username: req.body.username });
    console.log(user);
    if (user === null) {
        return res.status(401).json({ error: "Cannot find the user" });
    }

    console.log("password:", req.body.password);
    console.log("user.password:", user.password);

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            res.status(200).json({ message: "Access Granted" });
        } else {
            res.status(200).json({ message: "Not allowed" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to authenticate" });
        console.log(error);
    }
}

module.exports = { userCreation, userLogging }