// App.js is the app file for the backend.
// Author: Vasile Grigoras (PSYVG1)

// Account Routes
// /api/account/
// /api/account/random
// /api/account/:accountID

// Transaction Routes
// /api/transactions/
// /api/transactions/:accountID/:date/:timeframe/
// /api/transactions/:accountID/:date/:timeframe/:category/
// /api/transactions/:accountID/:date/:timeframe/sub/:subcategory/

// Import modules
import express from 'express';
import cors from 'cors';
// Import local modules
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

export default app;