const User = require("../../models/user");
const Watchlist = require("../../models/watchlist");
const bcrypt = require("bcrypt");
const session = require("express-session");

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
    if (user === null || !user) {
        return res.status(401).json({ error: "Cannot find the user" });
    }

    try {
        if (await bcrypt.compare(req.body.password, user.password)) {
            req.session.userId = user._id;
            console.log(req.session.userId);
            res.status(200).json({ message: "Access Granted" });
        } else {
            res.status(200).json({ message: "Not allowed" });
        }

    } catch (error) {
        res.status(500).json({ error: "Failed to authenticate" });
        console.log(error);
    }
}

async function watchlistCreation(req, res) {
    try {
        Watchlist.create({
            user_id: req.session.userId,
            coin_id: req.body.coin_id,
            added_at: new Date(Date.now())
        });
        res.status(200).json("Success");
    } catch (error) {
        res.status(500).json({ error: error })
    }
}

async function getWatchlist(req, res) {
    const watchlist = await Watchlist.find({ user_id: req.session.userId });
    if (watchlist === null) {
        return res.status(401).json("Not found");
    }

    try {
        res.status(200).json(watchlist);
    } catch (error) {
        res.status(500).json({ error: error });
        console.log(error);
    }
}

module.exports = { userCreation, userLogging, watchlistCreation, getWatchlist }