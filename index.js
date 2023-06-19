const express = require("express")
const path = require("path")
const bodyParser = require("body-parser")
const favicon = require("serve-favicon")
const app = express()
const port = 3030

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(favicon(path.join(__dirname, "public/assets/logos/logo-name.png")))
app.use(express.static(path.join(__dirname, "public")))

app.use("/", require("./routes/dashboard_router"))

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views/login.html"))
})

// app.get("/add-stock", (req, res) => {
//   res.sendFile(path.join(__dirname, "views/add_stock.html"))
// })

app.get("/view-transactions", (req, res) => {
  res.sendFile(path.join(__dirname, "views/view_transactions.html"))
})

app.listen(port, () => {
  console.log(`SmartStock GPS listening on http://localhost:${port}`)
})
