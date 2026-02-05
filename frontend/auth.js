const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const form = new FormData(registerForm); //gets the form
    const data = Object.fromEntries(form.entries()); //gets the data from the form

    console.log([...form.entries()]);
    console.log(JSON.stringify(data));

    const res = await fetch('/users/register', {
        method: 'POST',
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(data)
    });

    console.log(await res.json());
});