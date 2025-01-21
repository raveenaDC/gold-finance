import express from 'express';
import * as chartAccountService from '../services/chart-account-head.service.js';

const router = express.Router();

router.post('/head/create', chartAccountService.createdChartAccount);
router.get('/', chartAccountService.getChartAccount);
router.post('/general-ledger', chartAccountService.getGeneralLedger);
router.post('/view/payment-receipt', chartAccountService.getReceiptPayment);
router.post('/view/trial/balance', chartAccountService.getTrialBalance)
router.post('/:chartId/add-amount', chartAccountService.createReceiptPayment)
router.get('/:chartId', chartAccountService.getTotalBalanceAmount)

export default router;