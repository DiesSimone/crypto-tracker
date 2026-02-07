const cardsDiv = document.getElementById("watchlistCards");
let fetchData;

async function fetchCards(){
    fetchData = await fetch("/prices");
    fetchData = await fetchData.json();
    console.log(fetchData);
    const res = await fetch("/users/watchlists");
    const data = await res.json();
    const filteredData = fetchData.filter((el) => {
        const matchId = el.id.toLowerCase().includes(data.forEach(el => {
            el.coin_id;
            console.log(el.coin_id);
        }));
        return matchId
    });

    console.log(filteredData);

    // data.forEach(el => {
    // });

    // dataRender.forEach(el => {
    //     cardsDiv.innerHTML = `<h4>Coin Info Overview:</h4>
    //     <label>Coin Name: ${el.name}</label><br>
    //     <label>Price: ${el.current_price}€</label><br>
    //     <label>Market Cap: ${formatNumber(el.market_cap)}€</label><br>
    //     <label>Total Volume: ${formatNumber(el.total_volume)}€</label><br>
    //     <label>Top Price in the last 24hr: ${el.high_24h}€</label><br>
    //     <label>Bottom Price in the last 24hr: ${el.low_24h}€</label><br>`
    // });
    
    console.log(data);
}

fetchCards();