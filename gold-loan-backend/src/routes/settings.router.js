import express from 'express';
import * as settingsService from '../services/settings.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.post('/rate', settingsService.createRateSettings)
router.post('/additional/charges', settingsService.createAdditionalSettings)
router.get('/view/rate', settingsService.viewAllRateSettings)
router.get('/view/additional/charges', settingsService.viewAllAdditionalSettings)

export default router;