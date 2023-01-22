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

// Get a random account from the database
// For testing purposes
// Author: Robert
app.get('/api/random/account', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Accounts").find({}).toArray(function(err, result) {
            if (err)
                throw err;
            var randomAccount = result[Math.floor(Math.random() * result.length)];
            db.close();
            res.send(randomAccount);
        });
    });
});

// Gets all transactions for a specific account
// Search by accountUUID (parameter) and timeframe (parameter)
// JSON object has category as the key and the amount as the value
// Author: Robert

// TODO: Add date range, MONTHLY, DAILY, WEEKLY
app.get('/api/:accountID/:timeframe/transactions/', (req, res) => {

    var accountID = req.params.accountID;
    var timeframe = req.params.timeframe;
    var transactionJson = {};

    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        dbo.collection("Transactions").find({accountUUID: accountID}).toArray(function(err, result) {
            if (err)
                throw err;
            
            // If there are no transactions, raise an error
            if(result.length == 0){
                res.status(404).send('No transactions found');
                db.close();
                return;  
            }

            // Loop through all transactions and add to JSON object
            for (var i = 0; i < Object.keys(result).length; i++) {
                var transactionCategory = result[i].merchant.category;
                var transactionAmount = Math.round(result[i].amount);

                // If the category exists and a refund is made, remove the amount from the existing value
                // if (transactionJson.hasOwnProperty(transactionCategory) && transactionAmount < 0) {
                //     // If the final value is negative, remove the category from the JSON object
                //     if (transactionJson[transactionCategory] + transactionAmount < 0) {
                //         delete transactionJson[transactionCategory];
                //         continue;
                //     }
                //     transactionJson[transactionCategory] -= transactionAmount;
                //     continue;
                // }else 
                if (transactionAmount < 0) {
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