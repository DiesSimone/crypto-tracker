const {fetchPrices} = require("../services/prices_service.js");
const {fetchPrice24h} = require("../services/prices_service.js");
const {fetchPrice7d} = require("../services/prices_service.js");
const {fetchPrice30d} = require("../services/prices_service.js");
const {fetchEurToUsd} = require("../services/prices_service.js");

async function getPrices(req,res){
    try {
        const prices = await fetchPrices();
        res.status(200).json(prices);
        console.log("Fetching prices");
    } catch (error) {
        res.status(500).json({error: "Failed to fetch prices"});
    }
}

async function getPrices24h(req, res) {
    try {
        const prices = await fetchPrice24h(req.query.coinId);
        res.status(200).json(prices)
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last 24 hours prices",
            errorInfo: error
        });
    }
}

async function getPrices7d(req, res){
    try {
        const prices = await fetchPrice7d(req.query.coinId);
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last 7 days prices",
            errorInfo: error
        })
    }
}

async function getPrices30d(req, res){
    try {
        const prices = await fetchPrice30d(req.query.coinId);
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last month prices",
            errorInfo: error
        })
    }
}

async function getEurToUsd(req, res){
    try {
        const conversion = await fetchEurToUsd();
        res.status(200).json(conversion);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch eur to usd price",
            errorInfo: error
        })
    }
}


module.exports = {
    getPrices, 
    getPrices24h, 
    getPrices7d, 
    getPrices30d,
    getEurToUsd
};