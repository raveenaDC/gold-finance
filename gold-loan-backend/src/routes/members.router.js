import express from 'express';
import * as memberServices from '../services/member.services.js';
import * as middlewares from '../middleware/index.js'
const router = express.Router();

router.get('/view', memberServices.viewMembers)
router.get('/:memberId/view', memberServices.viewMemberById)
router.patch('/:memberId/access/deny', memberServices.denyMember)
router.patch('/:memberId/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), memberServices.updateMember)
router.post('/create', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), memberServices.createMember)

export default router;