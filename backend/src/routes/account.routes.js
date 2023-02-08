// Account Routes
// Author: Vasile Grigoras (PSYVG1)

// Import modules
import { Router } from 'express';

// Local Modules
import accountControllers from '../controllers/account.controllers.js';

// Initialization
const router = Router();

// Requests 
router.get('/', accountControllers.baseAccount);
router.get('/:accountID', accountControllers.getAccount);
router.get('/random', accountControllers.randomAccount);

export default router;