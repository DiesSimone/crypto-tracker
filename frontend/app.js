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
let overviewData;
let usdPrice;
let last24hRes;
let last24hData;
let last7dData;
let last30dData;
let filteredData = [];
let chartGenerationCount = 0;
let chart = null;
let eurCurrency = true;
let currentGraphInterval = 1; //0: 1H, 1: 24H, 2: 7D. 3:30D;
let fetchCounter = 0;
let MAX = 1;
let fetchCooldown = 60;
let cache;
let myInterval = null;

if (localStorage.getItem("cache") === null){
    localStorage.setItem("cache", JSON.stringify({
        counter: 0,
        overviewCache: {},
        eurToUsdCache: {}
    }));
    cache = JSON.parse(localStorage.getItem("cache"));
} else {
    cache = JSON.parse(localStorage.getItem("cache"));
    fetchCounter = cache.counter;
    overviewData = cache.overviewCache;
}

form.addEventListener("submit", async (el) => {
    el.preventDefault();
    cardsDiv.innerHTML = "";
    infoDiv.innerHTML = "";
    chartDiv.style.display = "block";
    await getData();
    filteredData = overviewData.filter((el) => {
        const matchName = el.name.toLowerCase().includes(coinName.value.toLowerCase()) || coinName.value === "";
        const matchSymbol = el.symbol.toLowerCase().includes(coinSymbol.value.toLowerCase()) || coinSymbol.value === "";
        return matchName && matchSymbol
    });
    renderCards();
})

async function getData() {
    let overviewRes;
    let eurToUsdRes
    if (fetchCounter > MAX){
        overviewRes = cache.overviewCache;
        eurToUsdRes = cache.eurToUsdCache;
        startCountdown();
    } 
    else {
        overviewRes = await fetch("/prices");
        // eurToUsdRes = await fetch("/prices/eurtousd");
        
        overviewRes = await overviewRes.json();
        // eurToUsdRes = await eurToUsdRes.json();
        
        cache.overviewCache = overviewRes;
        // cache.eurToUsdCache = eurToUsdRes;
        fetchCounter++;
        cache.counter = fetchCounter;
        localStorage.setItem("cache", JSON.stringify(cache));
    }
    overviewData = overviewRes;
    let eurToUsdData = eurToUsdRes;
    // usdPrice = eurToUsdData.data.rates.USD;
    usdPrice = 1.19;
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
        <label>Price: ${el.current_price}€</label><br>
        <label>Market Cap: ${formatNumber(el.market_cap)}€</label><br>
        <label>Total Volume: ${formatNumber(el.total_volume)}€</label><br>
        <label>Top Price in the last 24hr: ${el.high_24h}€</label><br>
        <label>Bottom Price in the last 24hr: ${el.low_24h}€</label><br>
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
                <label>Price: ${el.current_price}€</label><br>
                <label>Top Price in the last 24hr: ${el.high_24h}€</label><br>
                <label>Bottom Price in the last 24hr: ${el.low_24h}€</label><br>
                <label>Market Cap: ${formatNumber(el.market_cap)}€</label><br>
                <label>Price Change in the last 24h: <label id="price-change">${el.price_change_24h}€, ${el.price_change_percentage_24h}%</label>
                
            `;
            let last24hRes = await fetch(`/prices/24h?coinId=${el.id}`);
            let last7dRes = await fetch(`/prices/7d?coinId=${el.id}`);
            let last30dRes = await fetch(`/prices/30d?coinId=${el.id}`);
            last24hData = await last24hRes.json();
            last7dData = await last7dRes.json();
            last30dData = await last30dRes.json();
            copyPrices = structuredClone(last24hData.prices);
            loadChart();
            lastH.addEventListener("click", async () => {
                copyPrices = structuredClone(last24hData.prices);
                copyPrices = copyPrices.slice(-14);
                currentGraphInterval = 0;
                loadChart();
            });

            last24H.addEventListener("click", async () => {
                copyPrices = structuredClone(last24hData.prices);
                currentGraphInterval = 1;
                loadChart();
            });

            last7D.addEventListener("click", async () => {
                copyPrices = structuredClone(last7dData.prices);
                currentGraphInterval = 2;
                loadChart();
            });

            last30D.addEventListener("click", async () => {
                copyPrices = structuredClone(last30dData.prices);
                currentGraphInterval = 3;
                loadChart();
            });

            currencySwitcher.addEventListener("click", async () => {
                eurCurrency = !eurCurrency;
                if (eurCurrency) {
                    currencySwitcher.textContent = "EUR";
                    let response;
                    if (currentGraphInterval === 1 || currentGraphInterval === 0){
                        response = await last24hData;
                    }
                    else if (currentGraphInterval === 2) {
                        response = await last7dData;
                    } 
                    else if (currentGraphInterval === 3) {
                        response = await last30dData;
                    }
                    let data = response;
                    copyPrices = await structuredClone(data.prices);
                    if (currentGraphInterval === 0) {
                        copyPrices = copyPrices.slice(-14);
                    }
                    loadChart();
                } else {
                    currencySwitcher.textContent = "USD";
                    let response;
                    if (currentGraphInterval === 1 || currentGraphInterval === 0){
                        response = await last24hData;
                    }
                    else if (currentGraphInterval === 2) {
                        response = await last7dData;
                    } 
                    else if (currentGraphInterval === 3) {
                        response = await last30dData;
                    }
                    let data = await response;
                    copyPrices = await structuredClone(data.prices);
                    copyPrices.forEach(el => {
                        el[1] = el[1] * usdPrice;
                    });
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

function startCountdown(){
    if (myInterval !== null) return;
    fetchCooldown = 60;
    myInterval = setInterval(() => {
        console.log(fetchCooldown);
        fetchCooldown--;

        if (fetchCooldown < 0){
            clearInterval(myInterval);
            fetchCounter = 0;
            myInterval = null;
        }
    }, 1000);
}