const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const favicon = require("serve-favicon")
const session = require("express-session")
const app = express()
const port = 3030

app.use(session({
    secret: 'secret-key',
    resave: true,
    cookie: { maxAge: Date.now() + (30 * 86400 * 1000) },
    saveUninitialized: false,
}))

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, "public/assets/logos/logo-name.png")))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/dashboard_router"))

app.use("/view-transactions", require("./routes/view_transactions_router"))

app.listen(port, () => {
    console.log(`SmartStock GPS listening on http://localhost:${port}`)
})
