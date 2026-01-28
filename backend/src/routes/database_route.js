const express = require("express");
const router = express.Router();
const {userCreation} = require("../controllers/database_controller");

router.get("/", userCreation)

module.exports = router;