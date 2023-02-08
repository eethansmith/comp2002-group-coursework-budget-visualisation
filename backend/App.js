// App.js is the main file for routes
// Author: Robert, Tom

// Routes
// /api/account/:accountID
// /api/random/account
// /api/:accountID/:timeframe/transactions/
// /api/:accountID/:timeframe/:category/transactions/

// Import modules
import express from 'express';
import cors from 'cors';
// MongoDB Util
import { getDB } from './mongoUtil.js';
// Create express app
const app = express();
app.use(cors());

// HELPER FUNCTIONS

// Future date (ISO Format) function
// Parameter : date (ISO Format), timeframe (daily, monthly)
// Return : future date (ISO Format)
// Author: Vasile Grigoras (PSYVG1)
function futureISODate(date, timeframe) {
    var futureDate = new Date(date);
    if (timeframe === 'daily') {
        // Set the future date to the next day
        futureDate.setDate(futureDate.getDate() + 1);
    }else if (timeframe === 'monthly') {
        // Set the future date to the first day of the next month
        futureDate.setMonth(futureDate.getMonth() + 1);
    }
    // Convert the future date to ISO Date format
    futureDate = futureDate.toISOString();
    return futureDate;
}

// Routes

// Base route
// Author: Tom
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
});

// Get a random account from the database
// For testing purposes
// Author: Vasile Grigoras (PSYVG1)
app.get('/api/random/account', (req, res) => {
    getDB().collection( 'Accounts' ).find({}).toArray(function(err, result) {
        if (err)
            throw err;
        var randomAccount = result[Math.floor(Math.random() * result.length)];
        // Remove _id from the JSON object
        delete randomAccount._id;
        // Return the account information
        res.send(randomAccount);
    });
});

// Get account id information
// Parameter : accountID
// Return : JSON object with account information
// Author: Vasile Grigoras (PSYVG1)
app.get('/api/account/:accountID', (req, res) => {
    // Get the accountID from the URL
    var accountID = parseInt(req.params.accountID);
    // Type check the accountID
    if (typeof accountID !== 'number') {
        res.status(400).send('Type error, accountID (int)');
        return;
    }
    // Connect to the database
    getDB().collection("Accounts").find({accountId: accountID}).toArray(function(err, result) {
        if (err)
            throw err;
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }
        // Remove _id from the JSON object
        delete result[0]._id;
        // Return the account information
        res.send(result);
    });
});

// Gets all transactions for a specific account
// Parameters : accountID, timeframe, date (unix timestamp)
// Return : JSON object with category and amount
// Author: Vasile Grigoras (PSYVG1)
app.get('/api/:accountID/:date/:timeframe/transactions/', (req, res) => {
    // Get the accountID, date and timeframe from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var date = parseInt(req.params.date);
    var transactionJson = {};

    // Type check the accountID and timeframe
    if (typeof accountID !== 'number' || typeof timeframe !== 'string' || typeof date !== 'number') {
        res.status(400).send('Type error, accountID (int) timeframe (string) date (int)');
        return;
    }

    // Check if timeframe is valid
    if (timeframe !== 'daily' && timeframe !== 'monthly') {
        res.status(400).send('Invalid timeframe, must be "daily" or "monthly"');
        return;
    }

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    // And between the current date and future date and amount is greater than 0
    var query = {'accountUUID': accountID, 'date': {$gte: currentDate, $lte: futureDate}, 
        'amount': {$gt: 0}}; 

    // Connect to MongoDB        
    getDB().collection("Transactions").find(query).toArray(function(err, result) {
        if (err)
            throw err;

        // If no data is not found, return empty JSON object
        if(result.length === 0){
            res.status(200).send({});
            return;  
        }

        // Loop through all transactions and add to JSON object
        for (var i = 0; i < Object.keys(result).length; i++) {
            var transactionCategory = result[i].merchant.category;
            var transactionAmount = parseFloat(result[i].amount);

            if (transactionJson.hasOwnProperty(transactionCategory)) {
                // If the category already exists, add the amount to the existing value
                transactionJson[transactionCategory] += transactionAmount;
                continue;
            }
            // If the category does not exist, add it to the JSON object
            transactionJson[transactionCategory] = transactionAmount;
        }
        res.send(transactionJson);
    });
});

// Get category information for a specific account and timeframe
// Sort the transactions by date
// Paremeters : accountID, date (unix timestamp), timeframe, category
// Return : JSON object with category information
// Author: Vasile Grigoras (PSYVG1)
app.get('/api/:accountID/:date/:timeframe/:category/transactions/', (req, res) => {
    // Get the accountID, date, timeframe and category from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var category = (req.params.category)[0].toUpperCase() + ((req.params.category).slice(1)).toLowerCase();
    var date = parseInt(req.params.date);
    var transactionJson = {};

    // Type check the accountID, timeframe and category
    if (typeof accountID !== 'number' || typeof timeframe !== 'string' 
    || typeof category !== 'string' || typeof date !== 'number') {
        res.status(400).send("Type error, accountID (int) timeframe (string)" +
            "category (string) date (int)");
        return;
    }

    // Check if timeframe is valid
    if (timeframe !== 'daily' && timeframe !== 'monthly') {
        res.status(400).send('Invalid timeframe, must be "daily" or "monthly"');
        return;
    }

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    var query = {'accountUUID': accountID, 'merchant.category': category, 
    'date': {$gte: currentDate, $lte: futureDate}, 'amount': {$gt: 0}};
    // Search by accountUUID, category, and between the current date and future date
    // Amount is greater than 0 and Sort by date in ascending order

    // Connect to the database
    getDB().collection("Transactions").find(query).sort({'date': 1}).toArray(function (err, result) {
        if (err)
            throw err;
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }

        for (var i = 0; i < Object.keys(result).length; i++) {
            // Add the merchant information to the JSON object
            transactionJson[i] = {
                'merchant': result[i].merchant.name,
                'amount': result[i].amount,
                'date': result[i].date
            };
        }

        // Return the merchant information as a JSON object
        res.send(transactionJson);
    });
});

export default app;