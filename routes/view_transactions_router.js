const express = require('express');
const path = require("path");
const client = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.get("", (req, res) => {
    if (req.session.authenticated)
        res.sendFile(path.join(__dirname, '../views/view_transactions.html'));
    else
        res.redirect('/');
});

router.post('/logout', async (req, res) => {
    req.session.destroy()
    res.json({ status: true })
})

router.post('/select_transactions', async (req, res) => {
    let transactions = await client.db("smartstock-db").collection("transactions").find().sort({ date_sold: -1 }).toArray();
    if (transactions.length == 0)
        res.json({ status: false })
    else {
        let result = {}
        let dates = new Array()
        let total_sales = new Array()
        let monthly_sales = {}

        // Grouping transactions by date
        transactions.forEach((transaction) => {
            let date = transaction.date_sold.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            if (result[date] == undefined) {
                dates.push(date)
                result[date] = []
            }
            result[date].push({
                _id: transaction._id,
                name: transaction.name,
                quantity: transaction.quantity,
                selling_price: transaction.selling_price,
                total: transaction.selling_price * transaction.quantity
            })
        })

        // Calculating each day total sale
        let month_total = 0
        for (let i = 0; i < dates.length; i++) {
            let day_total = 0
            result[dates[i]].forEach((transaction) => {
                day_total += transaction.total
            })
            total_sales.push(day_total)
            month_total += day_total
            if (i != dates.length - 1 && dates[i].split(" ")[0] != dates[i + 1].split(" ")[0]) {
                monthly_sales[dates[i].split(" ")[0]] = month_total
                month_total = 0
            }
        }
        monthly_sales[dates[dates.length - 1].split(" ")[0]] = month_total

        res.json({
            status: true,
            dates: dates,
            transactions: result,
            total_sales: total_sales,
            monthly_sales: monthly_sales
        })
    }
})

module.exports = router