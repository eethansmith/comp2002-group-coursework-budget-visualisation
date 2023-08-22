// Trends Routes

// Import modules
import { Router } from 'express';

// Local Modules
import trendsControllers from '../Controllers/trends.controllers.js';


// Initialization
const router = Router();

// Requests 
router.get('/', trendsControllers.baseTrends);
router.get('/:accountID/', trendsControllers.getThisYearsTrends);

// Export the router
export default router;