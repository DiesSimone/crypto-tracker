async function getPrices(req,res){
    try {
        const prices = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur`).then(res => res.json());
        res.status(200).json(prices);
        console.log("Fetching prices");
    } catch (error) {
        res.status(500).json({error: "Failed to fetch prices"});
        console.log(error);
    }
}

async function getPrices24h(req, res) {
    try {
        const prices = await fetch(`https://api.coingecko.com/api/v3/coins/${req.query.coinId}/market_chart?vs_currency=eur&days=1`).then(res => res.json());
        res.status(200).json(prices)
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last 24 hours prices",
            errorInfo: error
        });
        console.log(error);
    }
}

async function getPrices7d(req, res){
    try {
        const prices = await fetch(`https://api.coingecko.com/api/v3/coins/${req.query.coinId}/market_chart?vs_currency=eur&days=7`).then(res => res.json());
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last 7 days prices",
            errorInfo: error
        })
        console.log(error);
    }
}

async function getPrices30d(req, res){
    try {
        const prices = await fetch(`https://api.coingecko.com/api/v3/coins/${req.query.coinId}/market_chart?vs_currency=eur&days=30`).then(res => res.json());
        res.status(200).json(prices);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch last month prices",
            errorInfo: error
        })
        console.log(error);
    }
}

async function getEurToUsd(req, res){
    try {
        const conversion = await fetch("https://free.ratesdb.com/v1/rates?from=EUR&to=USD");
        res.status(200).json(conversion);
    } catch (error) {
        res.status(500).json({
            error: "Failed to fetch eur to usd price",
            errorInfo: error
        })
        console.log(error);
    }
}


module.exports = {
    getPrices, 
    getPrices24h, 
    getPrices7d, 
    getPrices30d,
    getEurToUsd
};