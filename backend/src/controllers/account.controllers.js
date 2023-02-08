// Account Controller
// Author: Vasile Grigoras (PSYVG1)

// Import local modules
import { getDB } from '../Util/mongo.util.js';

// Base account route
// Author: Vasile Grigoras (PSYVG1)
const baseAccount = (req, res)=>{
    res.send('Account base route.' + 
    'Use /api/account/:accountID to get account information.' +
    'Use /api/account/random to get a random account');
}

// Get account id information
// Parameter : accountID
// Return : JSON object with account information
// Author: Vasile Grigoras (PSYVG1)
const getAccount = (req, res)=>{
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
}

// Get a random account from the database
// For testing purposes
// Author: Vasile Grigoras (PSYVG1)
const randomAccount = (req, res)=>{
    getDB().collection("Accounts").find({}).toArray(function(err, result) {
        if (err)
            throw err;
        // If no data is not found, return empty JSON object
        if (result.length === 0) {
            res.status(200).send({});
            return;
        }
        var randomAccount = result[Math.floor(Math.random() * result.length)];
        // Remove _id from the JSON object
        delete randomAccount._id;
        // Return the account information
        res.send(randomAccount);
    });
}

// Export of all methods as object
export default {
    baseAccount,
    getAccount,
    randomAccount,
}