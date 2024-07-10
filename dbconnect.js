const { MongoClient } = require('mongodb');
const username = 'system';
const password = 'smartstock_gps'
const client = new MongoClient(`mongodb+srv://${username}:${password}@smartstock-db.ovl8fof.mongodb.net/?retryWrites=true&w=majority&appName=smartstock-db`);

module.exports = client