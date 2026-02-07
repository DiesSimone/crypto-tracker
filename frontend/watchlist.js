const cardsDiv = document.getElementById("watchlistCards");

async function fetchCards(){
    const res = await fetch("/users/watchlists");
    const data = await res.json();

    console.log(data);
}

fetchCards();