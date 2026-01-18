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
        return matchName //&& matchSymbol
    });
    filteredData.forEach(el => {
        let newCard = document.createElement("div");
        newCard.innerHTML = `
        <label>Coin Name: ${el.name}</label>
        `;
        cardsDiv.append(newCard);
    });
})

async function getData(){
    response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=eur");
    data = await response.json();
}