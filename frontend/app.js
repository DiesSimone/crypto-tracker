const form = document.getElementById("form");
const coinName = document.getElementById("coin-name");
const coinSymbol = document.getElementById("coin-symbol");
const submitBtn = document.getElementById("submit-btn");
const cardsDiv = document.getElementById("crypto-cards");
const wrapper = document.getElementById("wrapper");
const infoDiv = document.getElementById("info-cards");
const ctx = document.getElementById('myChart');
const chartDiv = document.getElementById("chart-container");
const lastH = document.getElementById("last-h");
const last24H = document.getElementById("last-24h");
const last7D = document.getElementById("last-7d");
const last30D = document.getElementById("last-30d");
const currencySwitcher = document.getElementById("currency-switcher");
chartDiv.style.display = "none";
let copyPrices;
let coinsResponse;
let coinsData;
let chartResponse;
let chartData;
let filteredData = [];
let chartGenerationCount = 0;
let chart = null;
let eurCurrency = true;
let currentGraphInterval = 1; //0: 1H, 1: 24H, 2: 7D. 3:30D

form.addEventListener("submit", async (el) => {
    el.preventDefault();
    cardsDiv.innerHTML = "";
    infoDiv.innerHTML = "";
    chartDiv.style.display = "block";
    await getData();
    filteredData = coinsData.filter((el) => {
        const matchName = el.name.toLowerCase().includes(coinName.value.toLowerCase()) || coinName.value === "";
        const matchSymbol = el.symbol.toLowerCase().includes(coinSymbol.value.toLowerCase()) || coinSymbol.value === "";
        return matchName && matchSymbol
    });
    renderCards();
})

async function getData() {
    coinsResponse = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur");
    coinsData = await coinsResponse.json();
}

function formatNumber(num) {
    if (num === null || num === undefined) return "-";
    if (num >= 1e12) return (num / 1e12).toFixed(2) + "T";
    if (num >= 1e9) return (num / 1e9).toFixed(2) + "M";
    if (num >= 1e6) return (num / 1e6).toFixed(2) + "K";
    if (num >= 1e3) return num;
}

function renderCards() {
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
        newCard.addEventListener("click", async () => {
            cardsDiv.innerHTML = "";
            let infoCard = document.createElement("div");
            infoCard.id = "info-card";
            infoCard.classList.add("cards");
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
            chartResponse = await fetch(`https://api.coingecko.com/api/v3/coins/${el.id}/market_chart?vs_currency=eur&days=1`);
            chartData = await chartResponse.json();
            copyPrices = chartData.prices;
            loadChart();
            lastH.addEventListener("click", async () => {
                copyPrices = chartData.prices;
                copyPrices = copyPrices.slice(-14);
                currentGraphInterval = 0;
                loadChart();
            });

            last24H.addEventListener("click", async () => {
                copyPrices = chartData.prices;
                currentGraphInterval = 1;
                loadChart();
            });

            last7D.addEventListener("click", async () => {
                let response = await fetch(`https://api.coingecko.com/api/v3/coins/${el.id}/market_chart?vs_currency=eur&days=7`);
                let data = await response.json();
                copyPrices = data.prices;
                currentGraphInterval = 2;
                loadChart();
            });

            last30D.addEventListener("click", async () => {
                let response = await fetch(`https://api.coingecko.com/api/v3/coins/${el.id}/market_chart?vs_currency=eur&days=30`);
                let data = await response.json();
                copyPrices = data.prices;
                currentGraphInterval = 3;
                loadChart();
            });

            currencySwitcher.addEventListener("click", async () => {
                eurCurrency = !eurCurrency;
                if (eurCurrency) {
                    currencySwitcher.textContent = "EUR";
                    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${el.id}/market_chart?vs_currency=eur&days=${requestByInterval()}`);
                    let data = await response.json();
                    copyPrices = data.prices;
                    if (currentGraphInterval === 0) {
                        copyPrices = copyPrices.slice(-14);
                    }
                    loadChart();
                } else {
                    currencySwitcher.textContent = "USD";
                    let response = await fetch(`https://api.coingecko.com/api/v3/coins/${el.id}/market_chart?vs_currency=usd&days=${requestByInterval()}`);
                    let data = await response.json();
                    copyPrices = data.prices;
                    if (currentGraphInterval === 0) {
                        copyPrices = copyPrices.slice(-14);
                    }
                    loadChart();
                }
            });
            let priceChange = infoCard.querySelector("#price-change");
            if (el.price_change_percentage_24h < 0) {
                priceChange.style.color = "red";
            }
            else {
                priceChange.style.color = "green";
            }
            infoDiv.appendChild(infoCard);
        })
        cardsDiv.append(newCard);
    });
}

async function loadChart() {
    if (chart == null) {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    label: "Price",
                    data: [],
                    borderColor: "#ffd700",
                    backgroundColor: "#ffd700",
                }]
            },
            options: {
                scales: {
                    x: {
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            color: "#3a3a3a"
                        }
                    },
                    y: {
                        ticks: {
                            color: "#ffffff"
                        },
                        grid: {
                            color: "#3a3a3a"
                        }
                    }
                }
            }
        });
    }
    chart.data.labels = [];
    chart.data.datasets[0].data = [];
    if (currentGraphInterval > 1) {
        copyPrices.forEach(dailyPrice => {
            console.log(dailyPrice);
            chart.data.labels.push(new Date(dailyPrice[0]).toLocaleDateString());
            chart.data.datasets[0].data.push(dailyPrice[1]);
        });
    } else {
        copyPrices.forEach(dailyPrice => {
            console.log(dailyPrice);
            chart.data.labels.push(new Date(dailyPrice[0]).toLocaleTimeString());
            chart.data.datasets[0].data.push(dailyPrice[1]);
        });
    }
    chart.update();
    chartGenerationCount++;
}

function requestByInterval() {
        if (currentGraphInterval === 0) {
            return 1;
        }
        if (currentGraphInterval === 1) {
            return 1;
        }
        if (currentGraphInterval === 2) {
            return 7;
        }
        if (currentGraphInterval === 3) {
            return 30;
        }
    }
