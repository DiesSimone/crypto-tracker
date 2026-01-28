const app = require("./app.js");
const PORT = process.env.PORT || 3000;
const path = require("path");
const connectDb = require("./db.js");

app.get("/", (req, res) =>{
    res.status(200).sendFile(path.join(__dirname, "..", "/frontend/index.html"));
})

app.all("*id", (req, res) => {
    res.status(200).send("<h1>404 - Page not Found</h1>")
});

async function startServer(){
    try {
        await connectDb();
        app.listen(PORT, () => {
            console.log(`Server is operative on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error with the server start");
    }
}

startServer();