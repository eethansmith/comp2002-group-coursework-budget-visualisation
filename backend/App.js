// App.js is the main file for the backend server
// It uses Express.js to create a server and connect to MongoDB
// Author: Robert, Tom

// Import modules
const express = require('express');
const cors = require('cors');
// MongoDB driver
const MongoClient = require('mongodb').MongoClient;
// MongoDB connection string
const url = "mongodb+srv://root:team32@cluster0.1mjhgpj.mongodb.net/test";
// Create express app
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

app.get('/api/transactions', (req, res) => {

    var testAccountID = '30506983';
    var transactionJson = {};

    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Transactions").find({accountUUID: testAccountID}).toArray(function(err, result) {
            if (err)
                throw err;
            // Loop through all transactions and add to JSON object
            for (var i = 0; i < Object.keys(result).length; i++) {
                var transactionCategory = result[i].merchant.category;
                var transactionAmount = Math.round(result[i].amount);

                // If the category exists and a refund is made, remove the amount from the existing value
                if (transactionJson.hasOwnProperty(transactionCategory) && transactionAmount < 0) {
                    // If the final value is negative, remove the category from the JSON object
                    if (transactionJson[transactionCategory] + transactionAmount < 0) {
                        delete transactionJson[transactionCategory];
                        continue;
                    }
                    transactionJson[transactionCategory] -= transactionAmount;
                    continue;
                }else if (transactionAmount < 0) {
                    // If the amount is negative, do not include it (refunds)
                    continue;
                }else if (transactionJson.hasOwnProperty(transactionCategory)) {
                    // If the category already exists, add the amount to the existing value
                    transactionJson[transactionCategory] += transactionAmount;
                    continue;
                }
                
                // If the category does not exist, add it to the JSON object
                transactionJson[transactionCategory] = transactionAmount;
            }
            db.close();
            res.send(transactionJson);
        });
    });
});

app.listen(4000, () => console.log('Listening on port 4000...'));