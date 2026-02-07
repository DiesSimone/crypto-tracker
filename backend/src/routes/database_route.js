const express = require("express");
const router = express.Router();
const {userCreation, userLogging, watchlistCreation, getWatchlist} = require("../controllers/database_controller");

router.post("/register", userCreation);
router.post("/login", userLogging);
router.post('/watchlist', auth, watchlistCreation);
router.get('/watchlists', auth, getWatchlist);

async function auth(req, res, next){
    if (!req.session.userId) return res.status(401).json({error: "Unauthorized"});
    // console.log(req.session.userId);
    next();
}

module.exports = router;