import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import * as models from '../models/index.js';

/**
 * middleware to validate request based on the schema.
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction } next
 */
export default async function memberAuthentication(req, res, next) {

    const accessToken = req.headers.accesstoken;

    if (!accessToken) {
        return responseHelper(res, httpStatus.UNAUTHORIZED, true, 'unauthorized');
    }
    const member = await models.memberModel.findOne({ member_token: accessToken });

    if (!member) {
        return responseHelper(res, httpStatus.UNAUTHORIZED, true, 'Unauthorized: Invalid token or member does not exist');

    } else {
        let userDetails = {
            member_token: member.member_token,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            role: member.role,
            member_id: member._id
        }
        req.member = userDetails;
        next();
    }
}

export { memberAuthentication };
