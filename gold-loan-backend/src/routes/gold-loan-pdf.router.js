import express from 'express';
import * as goldLoanPdf from '../services/gold-loan-pdf.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.get('/view/document', goldLoanPdf.viewGoldLoanPdf)
router.get('/document/customer/:customerId', goldLoanPdf.viewGoldLoanPdfByCustomerId)
router.delete('/document/:documentId', goldLoanPdf.removePdf)
router.post('/add/document', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('documents')
), validator.loanDocumentValidation, goldLoanPdf.addGoldPdf)

export default router;