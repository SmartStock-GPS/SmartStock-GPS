const express = require('express');
const path = require("path");
const client = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.get("", (req, res) => {
    // if (req.session.authenticated)
    res.sendFile(path.join(__dirname, '../views/dashboard.html'));
    // else
    // res.sendFile(path.join(__dirname, '../views/login.html'));
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
        current_stock: parseInt(req.body.current_stock),
        sold_stock: 0,
        purchase_price: parseInt(req.body.purchase_price),
        selling_price: parseInt(req.body.selling_price),
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
                purchase_price: parseInt(req.body.purchase_price),
                selling_price: parseInt(req.body.selling_price),
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
                current_stock: parseInt(req.body.updated_stock)
            },
            $set: {
                updated_stock: parseInt(req.body.updated_stock),
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
                current_stock: parseInt(req.body.updated_stock) * -1,
                sold_stock: parseInt(req.body.updated_stock)
            },
            $set: {
                updated_stock: parseInt(req.body.updated_stock) * -1,
                last_sold: new Date()
            }
        })

    let item = await client.db("smartstock-db").collection("stock-items").find({ _id: new ObjectId(req.body.id) }).toArray();

    let transaction = await client.db("smartstock-db").collection("transactions").find({ name: item[0].name }).toArray();

    if (transaction.length == 0 || compareDates(transaction[0].date_sold, new Date()) != 0) {
        await client.db("smartstock-db").collection("transactions").insertOne({
            name: item[0].name,
            quantity: parseInt(req.body.updated_stock),
            selling_price: parseInt(item[0].selling_price),
            date_sold: new Date()
        })
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }))
    } else {
        await client.db("smartstock-db").collection("transactions").updateOne(
            {
                name: item[0].name,
            },
            {
                $inc: {
                    quantity: parseInt(req.body.updated_stock),
                },
                $set: {
                    date_sold: new Date()
                }
            }
        )
            .then(() => res.json({ status: true }))
            .catch(() => res.json({ status: false }))
    }
})

router.post('/delete_stock', async (req, res) => {
    await client.db("smartstock-db").collection("stock-items").deleteOne({ _id: new ObjectId(req.body.id) })
        .then(() => res.json({ status: true }))
        .catch(() => res.json({ status: false }))
})

router.post('/logout', async (req, res) => {
    req.session.destroy()
    res.json({ status: true })
})

function compareDates(date1, date2) {
    const year1 = date1.getFullYear();
    const month1 = date1.getMonth();
    const day1 = date1.getDate();
    const year2 = date2.getFullYear();
    const month2 = date2.getMonth();
    const day2 = date2.getDate();
    if (year1 !== year2)
        return year1 - year2;
    if (month1 !== month2)
        return month1 - month2;
    return day1 - day2;
}


module.exports = router