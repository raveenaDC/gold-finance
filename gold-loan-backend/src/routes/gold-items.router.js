import express from 'express';
import * as goldItemServices from '../services/gold-item.services.js';
import * as middlewares from '../middleware/index.js'
const router = express.Router();

router.get('/view-items', goldItemServices.viewGoldItem)
router.get('/view-item/:itemId', goldItemServices.viewGoldItemById)
router.delete('/remove/item/:itemId', goldItemServices.removeGoldItem)
router.patch('/update-item/:itemId', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), goldItemServices.updateGoldItemById)
router.post('/add-item', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), goldItemServices.addGoldItem)

export default router;