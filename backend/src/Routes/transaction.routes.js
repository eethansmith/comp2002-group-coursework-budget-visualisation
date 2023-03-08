// Transaction Routes
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import { Router } from 'express';

// Local Modules
import accountControllers from '../Controllers/transaction.controllers.js';

// Initialization
const router = Router();

// Requests
router.get('/', accountControllers.baseTransaction);
router.get('/:accountID/:date/:timeframe/', accountControllers.getTransactions);
router.get('/:accountID/:date/:timeframe/:category/', accountControllers.getTransactionsByCategory);
router.get('/:accountID/:date/:timeframe/sub/:subcategory/', accountControllers.getTransactionsBySubcategory);

// Export the router
export default router;