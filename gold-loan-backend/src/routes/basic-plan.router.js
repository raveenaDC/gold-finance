import express from 'express';
import * as basicService from '../services/basic-plan.service.js';
import * as middlewares from '../middleware/index.js'
import * as validator from '../validations/index.js'
const router = express.Router();

router.post('/basic-plan', basicService.createBasicPlan)
router.get('/basic-plan-view', basicService.viewAllBasicPlan)
router.post('/basic-plan/delete', basicService.deleteBasicPlan)

export default router;