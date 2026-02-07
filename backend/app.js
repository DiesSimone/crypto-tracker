//refering to modules
const express = require("express");
const session = require("express-session");
const path = require("path");
const app = express(); //creating the app
const cors = require("cors");
const pricesRoute = require("./src/routes/prices_route.js");
const dbRoute = require("./src/routes/database_route.js");

app.use(cors());//accepts requests from any domain
app.use(express.json()); //interprets all JSON requests
app.use(session({
    secret: "trialsecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}));
app.use("/prices", pricesRoute);
app.use("/users", dbRoute);
app.use(express.static(path.join(__dirname, "..", "frontend")));


module.exports = app;