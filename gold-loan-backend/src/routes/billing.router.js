import express from 'express';
import * as billingService from '../services/billing.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.post('/transaction', billingService.createGoldLoanBilling)
router.get('/transaction/gold-loan/:goldLoanId/bills', billingService.viewGoldLoanBillingDetails)
router.patch('/transaction/bill/:billId/cancel', billingService.cancelBillingDetails)
router.get('/transaction/view', billingService.viewAllGoldLoanBilling)
router.get('/transaction/view/:billId', billingService.viewGoldLoanBillingById)

export default router;