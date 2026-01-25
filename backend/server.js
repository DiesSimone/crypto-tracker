const app = require("./app");
const PORT = process.env.PORT || 3000;
const path = require("path");

app.get("/", (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, "..", "/frontend/index.html"));
})

app.all("*id", (req, res) => {
    res.status(200).send("<h1>404 - Page not Found</h1>")
});

app.listen(PORT, () => {
    console.log(`Server is operative on port ${PORT}`);
});