import express from 'express';
import * as billingService from '../services/billing.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.post('/transaction', billingService.createGoldLoanBilling)

export default router;