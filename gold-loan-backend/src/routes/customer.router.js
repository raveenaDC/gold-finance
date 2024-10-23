import express from 'express';
import * as customerServices from '../services/customer.services.js';
import * as middlewares from '../middleware/index.js'
const router = express.Router();

router.get('/details/view', customerServices.customerView)
router.get('/:customerId/details/view', customerServices.customerViewById)
// router.patch('/:memberId/access/deny', customerServices.denyMember)
router.patch('/:customerId/details/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), customerServices.updateCustomer)
router.post('/create', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), customerServices.createCustomer)

export default router;