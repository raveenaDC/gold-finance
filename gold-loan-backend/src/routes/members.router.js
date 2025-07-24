import express from 'express';
import * as memberServices from '../services/member.services.js';
import * as middlewares from '../middleware/index.js';
const router = express.Router();

router.get('/view', middlewares.memberAuthentication, memberServices.viewMembers)
router.post('/login/api', memberServices.loginMembers);
router.post('/logout/api/page', middlewares.memberAuthentication, memberServices.logoutMembers)
router.get('/:memberId/view', memberServices.viewMemberById)
router.patch('/:memberId/access/deny', memberServices.denyMember)
router.patch('/:memberId/update', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), memberServices.updateMember)
router.post('/create', middlewares.handleMulterErrors(
    middlewares.fileUploadMiddleWare('images/')
), memberServices.createMember)

//Roles

router.get('/roles', memberServices.getAllRoles)
router.post('/role', memberServices.addRoles);
router.patch('/role/:roleId', memberServices.deleteRole)
router.patch('/role/:roleId/update', memberServices.updateRole)

export default router;