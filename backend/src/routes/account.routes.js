// Account Routes
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import { Router } from 'express';

// Local Modules
import accountControllers from '../Controllers/account.controllers.js';

// Initialization
const router = Router();

// Requests 
router.get('/', accountControllers.baseAccount);
router.get('/random', accountControllers.randomAccount);
router.get('/:accountID', accountControllers.getAccount);

export default router;