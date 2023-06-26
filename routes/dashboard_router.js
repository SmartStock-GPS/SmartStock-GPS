const express = require('express');
const path = require("path");
const client = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.get("", (req, res) => {
    if (req.session.authenticated)
        res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    else
        res.sendFile(path.join(__dirname, '../views/login.html'));
});

router.post("/check-user", async (req, res) => {
    let result = await client.db("smartstock-db").collection("login-details").find({ username: req.body.username, password: req.body.password }).toArray();
    if (result.length != 0) {
        req.session.authenticated = true;
        res.json({ status: true })
    } else {
        res.json({ status: false })
    }
})

router.post("/select_stock", async (req, res) => {
    let items = await client.db("smartstock-db").collection("stock-items").find().sort({ last_updated: -1 }).toArray();
    res.json({
        status: true,
        items: items
    });
});

router.post("/add_stock", async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").insertOne({
        name: req.body.name,
        quantity: parseInt(req.body.quantity),
        price: req.body.price,
        last_updated: new Date()
    }).catch(() => res.json({ status: false }))

    let item = await client.db("smartstock-db").collection("stock-items").find({ name: req.body.name }).toArray()
    if (item.length != 0)
        res.json({ status: true, id: item[0]._id })
})

router.post("/select_stock_from_name", async (req, res) => {
    let items = await client.db("smartstock-db").collection("stock-items").find({ name: req.body.name }).toArray();
    if (items.length != 0)
        res.json(items[0]);
})

router.post("/update_stock", async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").updateOne(
        {
            _id: new ObjectId(req.body.id)
        },
        {
            $set: {
                name: req.body.name,
                price: req.body.price,
                last_updated: new Date()
            }
        })
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }))
})

router.post('/increment_stock', async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").updateOne(
        {
            _id: new ObjectId(req.body.id)
        },
        {
            $inc: {
                quantity: parseInt(req.body.quantity)
            },
            $set: {
                last_updated: new Date()
            }
        })
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }))
})

router.post('/decrement_stock', async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").updateOne(
        {
            _id: new ObjectId(req.body.id)
        },
        {
            $inc: {
                quantity: parseInt(req.body.quantity) * -1
            },
            $set: {
                last_sold: new Date()
            }
        })
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }))
})

router.post('/logout', async (req, res) => {
    req.session.destroy()
    res.json({ status: true })
})


module.exports = router