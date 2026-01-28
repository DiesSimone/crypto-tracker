const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: Number,
            required: true,
            unique: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            unique: false,
        },
        created_at: {
            type: Date,
            required: true,
            unique: false,
        }
    }
);

const user = mongoose.model("User", userSchema);

module.exports = user;