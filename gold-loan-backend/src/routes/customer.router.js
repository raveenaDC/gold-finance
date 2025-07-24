import express from 'express';
import * as customerServices from '../services/customer.services.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.get('/details/view', validator.customerGetValidation, middlewares.validationCheckMiddleWare, customerServices.customerView)
router.get('/:customerId/details/view', customerServices.customerViewById)
// router.patch('/:memberId/access/deny', customerServices.denyMember)
router.patch('/:customerId/details/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), validator.customerValidation, middlewares.validationCheckMiddleWare, customerServices.updateCustomer)
router.post('/create', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), validator.customerValidation, validator.customerPostValidation, middlewares.validationCheckMiddleWare, customerServices.createCustomer)

export default router;