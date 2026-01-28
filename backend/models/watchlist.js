const mongoose = require("mongoose");

const watchlistSchema = mongoose.Schema(
    {
        id: {
            type: Number,
            required: true,
            unique: true
        },
        user_id: {
            type: Number,
            required: true,
            unique: true
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