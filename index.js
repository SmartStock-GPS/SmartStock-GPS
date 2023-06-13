const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const favicon = require("serve-favicon");
const app = express();
const port = 3030;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "logo.png")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(port, () => {
    console.log(`SmartStock GPS listening on http://localhost:${port}`)
})