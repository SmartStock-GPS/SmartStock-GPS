const express = require('express');
const path = require("path");
const client = require('../dbconnect');
const ObjectId = require('mongodb').ObjectId;
const router = express.Router();

router.get("", (req, res) => {
    // if (req.session.authenticated)
    res.sendFile(path.join(__dirname, '../views/view_transactions.html'));
    // else
    // res.redirect('/');
});

router.post('/logout', async (req, res) => {
    req.session.destroy()
    res.json({ status: true })
})

module.exports = router