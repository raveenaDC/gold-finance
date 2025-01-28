import express from 'express';
import * as pledgeService from '../services/pledge-transaction.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.post('/add-bank-details', pledgeService.addBankPledgeDetails)
router.post('/add/pledge-details', pledgeService.addPledgeTransactions)
router.post('/transaction', pledgeService.pledgeTransactionsBill)
router.get('/view/bank-name', pledgeService.getBankName)

export default router;