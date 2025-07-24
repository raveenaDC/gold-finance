import express from 'express';
import * as dashboardService from '../services/dashboard.service.js';
import * as middlewares from '../middleware/index.js'
const router = express.Router();

router.get('/view/details', middlewares.memberAuthentication, dashboardService.homePageDataCounts)

export default router;