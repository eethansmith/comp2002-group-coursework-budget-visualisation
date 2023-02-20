// Account Controller
// Author: Vasile Grigoras (PSYVG1)

// Import local modules
import mongoUtil from '../Util/mongo.util.js';

// Base account route
// Author: Vasile Grigoras (PSYVG1)
const baseAccount = (req, res)=>{
    res.status(200).send('Account base route.' + 
    'Use /api/account/:accountID to get account information.' +
    'Use /api/account/random to get a random account');
}

// Description : Get account id information
// Author: Vasile Grigoras (PSYVG1)
// Parameter : accountID
// Return : JSON object with account information
const getAccount = async (req, res)=>{
    // Get the accountID from the URL
    var accountID = parseInt(req.params.accountID);
    // Type check the accountID, parseInt returns NaN if it is not a number
    if (isNaN(accountID)) {
        res.status(400).send('Type error, accountID (int)');
        return;
    }
    // Get the database connection
    const db = await mongoUtil.getDB();
    // Connect to the database
    db.collection("Accounts").find({accountId: accountID}).toArray(function(err, result) {
        // If there is an error, return 500 and the error
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;     
        }
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }
        // Remove _id from the JSON object
        delete result[0]._id;
        // Return the account information
        res.status(200).send(result);
    });
}

// Get a random account from the database
// For testing purposes
// Author: Vasile Grigoras (PSYVG1)
const randomAccount = async (req, res)=>{
    // Get the database connection
    const db = await mongoUtil.getDB();
    // Connect to the database
    db.collection("Accounts").find({}).toArray(function(err, result) {
        // If there is an error, return 500 and the error
        if (err){
            res.status(500).send('Error: ' + err);
            throw err;     
        }
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            // Code 204 is for no content
            res.status(200).send({});
            return;
        }
        var randomAccount = result[Math.floor(Math.random() * result.length)];
        // Remove _id from the JSON object
        delete randomAccount._id;
        // Return the account information
        res.status(200).send(randomAccount);
    });
}

// Export of all methods
export default {
    baseAccount,
    getAccount,
    randomAccount,
}