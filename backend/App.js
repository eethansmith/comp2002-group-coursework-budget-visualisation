const express = require('express');
const cors = require('cors');
// MongoDB driver
const MongoClient = require('mongodb').MongoClient;
// MongoDB connection string
const url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";

const app = express();

app.use(cors());

app.get('/', (req, res) => {
    res.send('Hello');
})

// User account
app.get('/api/account', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Accounts").findOne({}, function(err, result) {
            if (err)
                throw err;
            res.json(result);
            db.close();
        });
    });
});

// Gets all transactions for a specific account
// Search by accountUUID and creates a JSON object 
// JSON objects has category as the key and the amount as the value

// TODO: Add date range, MONTHLY, DAILY
// TODO: Fix negative values (they are currently being added to the total as positive values)
app.get('/api/users', (req, res) => {

    var testAccountID = '30506983';
    var transactionJson = {};

    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Transactions").find({accountUUID: testAccountID}).toArray(function(err, result) {
            if (err)
                throw err;
            // Get the length of the result object
            var resultLength = Object.keys(result).length;
            // Loop through all transactions and add to JSON object
            for (var i = 0; i < resultLength; i++) {
                var transactionCategory = result[i].merchant.category;
                var transactionAmount = Math.round(Math.abs(result[i].amount));
                transactionJson[transactionCategory] = transactionAmount;
            }
            db.close();
            res.send(transactionJson);
        });
    });
});

app.listen(4000, () => console.log('Listening on port 4000...'));