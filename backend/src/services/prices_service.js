async function fetchPrices(){
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur`);
    return res.json();
}

async function fetchPrice24h(coinId){
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=1`);
    return res.json();
}

async function fetchPrice7d(coinId){
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=7`);
    return res.json();
}

async function fetchPrice30d(coinId){
    const res = await fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=eur&days=30`);
    return res.json();
}

async function fetchEurToUsd(){
    const res = await fetch("https://free.ratesdb.com/v1/rates?from=EUR&to=USD");
    return res.json();
}

module.exports = {fetchPrices, 
    fetchPrice24h, 
    fetchPrice7d, 
    fetchPrice30d,
    fetchEurToUsd
};