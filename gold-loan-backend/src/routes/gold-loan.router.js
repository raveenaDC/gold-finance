import express from 'express';
import * as goldLoanServices from '../services/gold-loan.service.js';
import * as middlewares from '../middleware/index.js'
const router = express.Router();

router.get('/loan-details/customer/:customerId', goldLoanServices.viewGoldLoan)
router.get('/loan/:loanId', goldLoanServices.viewGoldLoanById)
//router.delete('/remove/item/:itemId', goldItemServices.removeGoldLoan)
router.patch('/loan/:loanId/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/goldItems')
), goldLoanServices.updateGoldLoanById)
router.post('/loan-details', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/goldItems')
), goldLoanServices.addGoldLoan)

export default router;