// Trends Controller

// Import local modules
import mongoUtil from '../Util/mongo.util.js';

// Base account route
const baseTrends = (req, res) => {
    res.status(200).send('Trends route');
}

const getThisYearsTrends = async (req, res) => {
    // Get the accountID, date, timeframe from the URL
    const accountID = parseInt(req.params.accountID);
    
    // Check parameters
    if (!accountID)
        return;

    // Get the current date and future date for the timeframe
    // ISO Date format
    const currentDate = new Date().toISOString();
    const previousYearDate = (new Date(new Date().setFullYear(new Date().getFullYear() - 1))).toISOString();

    // MongoDB query to find all transactions for the account
    // And between the current date and future date and amount is greater than 0
    var query = {'accountID': accountID, 'date': {$gte: previousYearDate, $lte: currentDate}, 
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
            res.status(200).send({message: "No Data Found"});
            return;  
        }
        res.status(200).send(result);
    });
}

// Export of all methods as object
export default {
    baseTrends,
    getThisYearsTrends,
}