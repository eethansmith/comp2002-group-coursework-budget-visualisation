// App.js is the main file for the backend server
// It uses Express.js to create a server and connect to MongoDB
// Author: Robert, Tom

// Endpoints
// /api/account/:accountID
// /api/random/account
// /api/:accountID/:timeframe/transactions/
// /api/:accountID/:timeframe/:category/transactions/

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

// Base route
// Author: Tom
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

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

// Get account id information
// Search by accountID (parameter)
// JSON object has account information
// Author: Robert
app.get('/api/account/:accountID', (req, res) => {
    var accountID = parseInt(req.params.accountID);
    // Type check the accountID
    if (typeof accountID !== 'number') {
        res.status(400).send('Type error, accountID (int)');
        return;
    }
    // Connect to the database
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        // Search for the accountID
        dbo.collection("Accounts").find({accountId: accountID}).toArray(function(err, result) {
            if (err)
                throw err;
            // If no data is not found, return empty JSON object
            if (result.length === 0) {
                res.status(200).send({});
                return;
            }
            // Return the account information
            res.send(result);
            db.close();
        });
    });
});

// Gets all transactions for a specific account
// Search by accountUUID (parameter) and timeframe (parameter)
// JSON object has category as the key and the amount as the value
// Author: Robert
app.get('/api/:accountID/:timeframe/transactions/', (req, res) => {
    // Get the accountID and timeframe from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var transactionJson = {};

    // Type check the accountID and timeframe
    if (typeof accountID !== 'number' || typeof timeframe !== 'string') {
        res.status(400).send('Type error, accountID (int) timeframe (string)');
        return;
    }

    // Check if timeframe is valid
    if (timeframe !== 'daily' && timeframe !== 'monthly') {
        res.status(400).send('Invalid timeframe, must be "daily" or "monthly"');
        return;
    }

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date();
    var futureDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    futureDate.setHours(0, 0, 0, 0);

    if (timeframe === 'daily') {
        // Set the future date to the next day
        futureDate.setDate(futureDate.getDate() + 1);
    }else if (timeframe === 'monthly') {
        currentDate.setDate(1);
        // Set the future date to the first day of the next month
        futureDate.setMonth(futureDate.getMonth() + 1);
        futureDate.setDate(1);
    }

    currentDate = currentDate.toISOString();
    futureDate = futureDate.toISOString();

    // Connect to MongoDB
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");

        // MongoDB query to find all transactions for the account
        // And between the current date and future date
        var query = {'accountUUID': accountID, 'date': {$gte: currentDate, $lte: futureDate}}; 

        dbo.collection("Transactions").find(query).toArray(function(err, result) {
            if (err)
                throw err;

            // If no data is not found, return empty JSON object
            if(result.length === 0){
                res.status(200).send({});
                db.close();
                return;  
            }

            // Loop through all transactions and add to JSON object
            // Add transaction category as key and transaction amount as 2 decimal point value
            for (var i = 0; i < Object.keys(result).length; i++) {
                var transactionCategory = result[i].merchant.category;
                var transactionAmount = parseFloat(result[i].amount);

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

// Get category information for a specific account and timeframe
// Search by accountUUID (parameter), category (parameter), time
// Returns merchant information as a JSON object
// Author: Robert
app.get('/api/:accountID/:timeframe/:category/transactions/', (req, res) => {
    // Get the accountID, timeframe and category from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var category = (req.params.category)[0].toUpperCase() + ((req.params.category).slice(1)).toLowerCase();
    var transactionJson = {};

    // Type check the accountID, timeframe and category
    if (typeof accountID !== 'number' || typeof timeframe !== 'string' || typeof category !== 'string') {
        res.status(400).send('Type error, accountID (int) timeframe (string) category (string)');
        return;
    }

    // Check if timeframe is valid
    if (timeframe !== 'daily' && timeframe !== 'monthly') {
        res.status(400).send('Invalid timeframe, must be "daily" or "monthly"');
        return;
    }

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date();
    var futureDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    futureDate.setHours(0, 0, 0, 0);
    
    if (timeframe === 'daily') {
        // Set the future date to the next day
        futureDate.setDate(futureDate.getDate() + 1);
    }else if (timeframe === 'monthly') {
        currentDate.setDate(1);
        // Set the future date to the first day of the next month
        futureDate.setMonth(futureDate.getMonth() + 1);
    }

    currentDate = currentDate.toISOString();
    futureDate = futureDate.toISOString();

    // Connect to the database
    MongoClient.connect(url, function (err, db) {
        if (err)
            throw err;
        var dbo = db.db("BudgetVisualisation");
        // MongoDB query to find all transactions for the account
        var query = {'accountUUID': accountID, 'merchant.category': category, 'date': {$gte: currentDate, $lte: futureDate}};
        // Search for the accountID, timeframe and category
        dbo.collection("Transactions").find(query).toArray(function(err, result) {
            if (err)
                throw err;
            // If no data is not found, return empty JSON object
            if (result.length === 0) {
                res.status(200).send({});
                return;
            }

            for (var i = 0; i < Object.keys(result).length; i++) {
                if(result[i].amount < 0)
                    continue;
                // Add the merchant information to the JSON object
                transactionJson[i] = {
                    'merchant': result[i].merchant.name,
                    'amount': result[i].amount,
                    'date': result[i].date
                };
            }

            // Return the merchant information as a JSON object
            res.send(transactionJson);
            db.close();
        });
    });
});

app.listen(4000, () => console.log('Listening on port 4000...'));