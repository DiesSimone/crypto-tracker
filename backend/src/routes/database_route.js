const express = require("express");
const router = express.Router();
const {userCreation, userLogging} = require("../controllers/database_controller");

router.post("/register", userCreation);
router.post("/login", userLogging);

module.exports = router;