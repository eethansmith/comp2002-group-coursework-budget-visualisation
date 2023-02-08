// App.js is the main file for the backend.
// Starts the server and connects to the database.
// Author: Vasile Grigoras (PSYVG1)

// Routes
// /api/account/:accountID
// /api/account/random
// /api/transactions/:accountID/:date/:timeframe/
// /api/transactions/:accountID/:date/:timeframe/:category/

// Import modules
import express from 'express';
import cors from 'cors';
// Import local modules
import { connectToServer } from './src/Util/mongo.util.js';
import accountRoute from './src/Routes/account.routes.js';
import transactionRoute from './src/Routes/transaction.routes.js';

// Create express app
const app = express();
app.use(cors());

// Account Routes
// Author: Vasile Grigoras (PSYVG1)
app.use('/api/account', accountRoute); 

// Transaction Routes
// Author: Vasile Grigoras (PSYVG1)
app.use('/api/transactions/', transactionRoute);

// Connect to the database and start the server
connectToServer( function( err, client ) {
    if (err){
        client.close();
        throw err;
    }
    app.listen(4000, () => console.log('Listening on port 4000...'));
});