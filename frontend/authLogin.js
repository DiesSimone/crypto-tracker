const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = new FormData(loginForm);
    const data = Object.fromEntries(form.entries());

    const res = await fetch('users/login', {
        method: 'POST',
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify(data)
    });

    console.log(await res.json());
})