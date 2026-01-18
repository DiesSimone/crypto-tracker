const form = document.getElementById("form");
const coinName = document.getElementById("coin-name");
const coinSymbol = document.getElementById("coin-symbol");
const submitBtn = document.getElementById("submit-btn");
const cardsDiv = document.getElementById("crypto-cards")
let response;
let data;
let filteredData = [];

form.addEventListener("submit", async (el) => {
    el.preventDefault();
    cardsDiv.innerHTML = "";
    await getData();
    filteredData = data.filter((el) => {
        const matchName = el.name.toLowerCase().includes(coinName.value.toLowerCase()) || coinName.value === "";
        const matchSymbol = el.symbol.toLowerCase().includes(coinSymbol.value.toLowerCase()) || coinSymbol.value === "";
        return matchName && matchSymbol
    });
    renderCards();
})

async function getData(){
    response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur");
    data = await response.json();
}

function formatNumber(num){
    if (num === null || num === undefined) return "-";
    if (num >= 1e12) return (num/1e12).toFixed(2) + "T"; 
    if (num >= 1e9) return (num/1e9).toFixed(2) + "M"; 
    if (num >= 1e6) return (num/1e6).toFixed(2) + "K"; 
    if (num >= 1e3) return num; 
}

function renderCards(){
    filteredData.forEach(el => {
        let newCard = document.createElement("div");
        newCard.id = "coin-card";
        newCard.innerHTML = `
        <h4>Coin Info Overview:</h4>
        <label>Coin Name: ${el.name}</label><br>
        <label>Price: ${el.current_price}$</label><br>
        <label>Market Cap: ${formatNumber(el.market_cap)}$</label><br>
        <label>Total Volume: ${formatNumber(el.total_volume)}$</label><br>
        <label>Top Price in the last 24hr: ${el.high_24h}$</label><br>
        <label>Bottom Price in the last 24hr: ${el.low_24h}$</label><br>
        `;
        newCard.addEventListener("click", () => {
            cardsDiv.innerHTML = "";
            let infoCard = document.createElement("div");
            infoCard.id = "info-card";
            infoCard.innerHTML = `
                <h4>Coin Overview:</h4>
                <img src="${el.image}" alt="Image for ${el.name}" id="info-card-logo"><br>
                <label>Coin Name: ${el.name}</label><br>
                <label>Coin Symbol: ${el.symbol}</label><br>
                <label>Marketcap Rank: ${el.market_cap_rank}</label><br>

                <h4>Coin Details:</h4>
                <label>Price: ${el.current_price}$</label><br>
                <label>Top Price in the last 24hr: ${el.high_24h}$</label><br>
                <label>Bottom Price in the last 24hr: ${el.low_24h}$</label><br>
                <label>Market Cap: ${formatNumber(el.market_cap)}$</label><br>
                <label>Price Change in the last 24h: <label id="price-change">${el.price_change_24h}$, ${el.price_change_percentage_24h}%</label></label>
                
            `;
            let priceChange = infoCard.querySelector("#price-change");
            if(el.price_change_percentage_24h < 0){
                priceChange.style.color = "red";
            }
            else{
                priceChange.style.color = "green";
            }
            cardsDiv.appendChild(infoCard);
        })
        cardsDiv.append(newCard);
    });
}