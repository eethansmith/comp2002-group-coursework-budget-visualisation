// Transaction controller
// Author: Vasile Grigoras (PSYVG1)

// Import local modules
import mongoUtil from "../Util/mongo.util.js";

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

// Check the category is in the list object
// Parameter : category (string)
// Return : boolean
function validCategory(category) {
    // Get the categories from the list
    var categories = [
        'Gifts & Donations',
        'Bills & Utilities',
        'Entertainment',
        'Auto & Transport',
        'Personal Care',
        'Shopping',
        'Food & Dining',
        'Education'
    ];
    // Check if the category is in the list
    if (categories.includes(category)) {
        return true;
    }
    return false;
}

// Parameter/input checking function
// Parameter : req (request), res (response)
// Return : boolean
// True if the parameters are valid and false if they are not
function parameterChecker(req, res) {
    // Get the accountID, date and timeframe from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var date = parseInt(req.params.date);
    // Check if accountID length is valid (8 digits)
    if (req.params.accountID.length !== 8) {
        res.status(400).send("Invalid accountID");
        return false;
    }

    // Type check the accountID and date
    if (isNaN(accountID) || isNaN(date)) {
        res.status(400).send('Type error, accountID (int) timeframe (string) date (int)');
        return false;
    }

    // Check if timeframe is valid
    if (timeframe !== 'daily' && timeframe !== 'monthly') {
        res.status(400).send('Invalid timeframe, must be "daily" or "monthly"');
        return false;
    }

    // Check if the category exists (for getTransactionsByCategory)
    if (req.params.category) {
        var category = (req.params.category)[0].toUpperCase() + 
            ((req.params.category).slice(1)).toLowerCase();
        if (!validCategory(category)) {
            res.status(400).send('Invalid category');
            return false;
        }
    }

    return true;
}

// Base transaction route
// Author: Vasile Grigoras (PSYVG1)
const baseTransaction = (req, res) => {
    res.status(200).send('Transaction route');
}

// Gets all transactions for a specific account and timeframe
// Parameters : accountID, timeframe, date (unix timestamp)
// Return : JSON object with category and amount
// Author: Vasile Grigoras (PSYVG1)
const getTransactions = async (req, res) => {
    // JSON object to store the category and amount
    var transactionJson = {};

    // Check parameters
    if (!parameterChecker(req, res))
        return;

    // Get the accountID, date and timeframe from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var date = parseInt(req.params.date);

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    // And between the current date and future date and amount is greater than 0
    var query = {'accountID': accountID, 'date': {$gte: currentDate, $lte: futureDate}, 
        'amount': {$gt: 0}}; 

    // Get the database connection
    const db = await mongoUtil.getDB();
    // Connect to MongoDB        
    db.collection("Transactions").find(query).toArray(function(err, result) {
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;            
        }

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
}

// Get category information for a specific account and timeframe
// Sort the transactions by date
// Paremeters : accountID, date (unix timestamp), timeframe, category
// Return : JSON object with category information
// Author: Vasile Grigoras (PSYVG1)
const getTransactionsByCategory = async (req, res) => {
    // JSON object to store the category and amount
    var transactionJson = {};

    // Check parameters
    if (!parameterChecker(req, res))
        return;  

    // Get the accountID, date, timeframe and category from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var category = (req.params.category)[0].toUpperCase() 
        + ((req.params.category).slice(1)).toLowerCase();
    var date = parseInt(req.params.date);
    
    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    var query = {'accountID': accountID, 'merchant.category': category, 
    'date': {$gte: currentDate, $lte: futureDate}, 'amount': {$gt: 0}};
    // Search by accountID, category, and between the current date and future date
    // Amount is greater than 0 and Sort by date in ascending order

    // Get the database connection
    const db = await mongoUtil.getDB();
    // Connect to the database
    db.collection("Transactions").find(query).sort({'date': 1}).toArray(function (err, result) {
        // If there is an error, send the error
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;     
        } 
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
}

// Get subcategory information for a specific account and timeframe
// Sort the transactions by date
// Paremeters : accountID, date (unix timestamp), timeframe, subcategory
// Return : JSON object with subcategory information
// Author: Vasile Grigoras (PSYVG1)
const getTransactionsBySubcategory = async (req, res) => {
    // JSON object to store the category and amount
    var transactionJson = {};

    // Check parameters
    if (!parameterChecker(req, res))
        return;
    
    // Get the accountID, date, timeframe and subcategory from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var subcategory = req.params.subcategory;
    var date = parseInt(req.params.date);

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    var query = {'accountID': accountID, 'merchant.subcategory': subcategory, 
    'date': {$gte: currentDate, $lte: futureDate}, 'amount': {$gt: 0}};
    // Search by accountID, category, and between the current date and future date
    // Amount is greater than 0 and Sort by date in ascending order

    // Get the database connection
    const db = await mongoUtil.getDB();
    // Connect to the database
    db.collection("Transactions").find(query).sort({'date': 1}).toArray(function (err, result) {
        // If there is an error, send the error
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;     
        } 
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }
        
        // Loop through all transactions and add to subcategory amount
        for (var i = 0; i < Object.keys(result).length; i++) {
            // Add the amount to the JSON object
            transactionJson[i] = {
                'merchant': result[i].merchant.name,
                'amount': result[i].amount,
                'date': result[i].date
            };
        }

        // Return the merchant information as a JSON object
        res.send(transactionJson);
    });
}

// Get subcategory amount for a specific account and timeframe
// Sort the transactions by date
// Paremeters : accountID, date (unix timestamp), timeframe
// Return : JSON object with subcategory information
// Author: Vasile Grigoras (PSYVG1)
const getTransactionsForAllSubcategories = async (req, res) => {
    // JSON object to store the subcategory and amount
    var transactionJson = {};
    // Subcategories to get information for
    var subcategories = ["Other", "Bills", "Groceries"]

    // Check parameters
    if (!parameterChecker(req, res))
        return;
    
    // Get the accountID, date, timeframe from the URL
    var accountID = parseInt(req.params.accountID);
    var timeframe = (req.params.timeframe).toLowerCase();
    var date = parseInt(req.params.date);

    // Get the current date and future date for the timeframe
    // ISO Date format
    var currentDate = new Date(date).toISOString();
    var futureDate = futureISODate(date, timeframe);

    // MongoDB query to find all transactions for the account
    var query = {'accountID': accountID, 'merchant.subcategory': {$in: subcategories},
    'date': {$gte: currentDate, $lte: futureDate}, 'amount': {$gt: 0}};
    // Search by accountID, category, and between the current date and future date
    // Amount is greater than 0 and Sort by date in ascending order

    // Get the database connection
    const db = await mongoUtil.getDB();

    // Connect to the database
    db.collection("Transactions").find(query).sort({'date': 1}).toArray(function (err, result) {
        // If there is an error, send the error
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;     
        } 
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }
        
        // Loop through all transactions and add amount to subcategory
        for (var i = 0; i < Object.keys(result).length; i++) {
            // Add the amount to the JSON object
            var transactionSubcategory = result[i].merchant.subcategory;
            var transactionAmount = parseFloat(result[i].amount);

            if (transactionJson.hasOwnProperty(transactionSubcategory)) {
                // If the subcategory already exists, add the amount to the existing value
                transactionJson[transactionSubcategory] += transactionAmount;
                continue;
            }

            // If the subcategory does not exist, add it to the JSON object
            transactionJson[transactionSubcategory] = transactionAmount;
        }

        // Return the merchant information as a JSON object
        res.send(transactionJson);
    });
}

// Export of all methods as object
export default {
    baseTransaction,
    getTransactions,
    getTransactionsByCategory,
    getTransactionsBySubcategory,
    getTransactionsForAllSubcategories,
}