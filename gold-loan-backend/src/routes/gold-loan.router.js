import express from 'express';
import * as goldLoanServices from '../services/gold-loan.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.get('/loan-details/customer/:customerId', goldLoanServices.viewGoldLoan)
router.get('/loan/:loanId', goldLoanServices.viewGoldLoanById)
router.get('/loan/approvals', goldLoanServices.viewGoldLoanApprovals)
router.post('/loan/make/approvals', validator.goldLoanApprovalValidation, middlewares.validationCheckMiddleWare, goldLoanServices.makeGoldLoanApprovals)
router.get('/loan/number/view', goldLoanServices.viewGoldLoanByGoldNumber)
//router.delete('/remove/item/:itemId', goldItemServices.removeGoldLoan)
router.patch('/loan/:loanId/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/goldItems')
), validator.goldLoanPostValidation, middlewares.validationCheckMiddleWare, goldLoanServices.updateGoldLoanById)
router.post('/loan-details', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/goldItems')
), validator.goldLoanPostValidation, middlewares.validationCheckMiddleWare, goldLoanServices.addGoldLoan)

router.patch('/loan/:loanId/update/status', validator.goldLoanStatusValidation, middlewares.validationCheckMiddleWare, goldLoanServices.updateGoldStatus)

export default router;