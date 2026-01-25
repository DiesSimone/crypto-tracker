const express = require("express");
const {getPrices} = require("../controllers/prices_controller.js");
const {getPrices24h} = require("../controllers/prices_controller.js");
const {getPrices7d} = require("../controllers/prices_controller.js");
const {getPrices30d} = require("../controllers/prices_controller.js");
const {getEurToUsd} = require("../controllers/prices_controller.js");
const router = express.Router();

router.get("/", getPrices);
router.get("/24h", getPrices24h);
router.get("/7d", getPrices7d);
router.get("/30d", getPrices30d);
router.get("/eurtousd", getEurToUsd);

module.exports = router;
