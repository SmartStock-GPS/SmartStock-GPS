const { MongoClient } = require('mongodb');
const username = 'system';
const password = 'smartstock_gps'
const client = new MongoClient(`mongodb+srv://${username}:${password}@smartstock-db.pdg3khb.mongodb.net/?retryWrites=true&w=majority`);

module.exports = client