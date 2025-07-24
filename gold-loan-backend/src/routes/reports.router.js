import express from 'express';
import * as reportService from '../services/reports.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.get('/all-loan', reportService.viewAllGoldLoan)

export default router;