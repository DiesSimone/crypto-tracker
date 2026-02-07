const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema(
    {
        user_id: {
            type: String,
            required: true,
            unique: false
        },
        coin_id: {
            type: String,
            required: true,
            unique: true
        },
        added_at: {
            type: Date,
            required: true,
            unique: false
        }
    }
)

const watchlist = mongoose.model("Watchlist", watchlistSchema)

module.exports = watchlist