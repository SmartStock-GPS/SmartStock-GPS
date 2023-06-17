const express = require('express');
const path = require("path");
const client = require('../dbconnect');
const router = express.Router();

router.get("", (req, res) => {
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
});

router.post("/select_stock", async (req, res) => {
    let items = await client.db("smartstock-db").collection("stock-items").find().toArray();
    res.json(items);
});


module.exports = router