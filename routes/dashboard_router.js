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

router.post("/add_stock", async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").insertOne({
        name: req.body.name,
        quantity: req.body.quantity,
        price: req.body.price,
        last_updated: req.body.last_updated
    })
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }))
})


module.exports = router