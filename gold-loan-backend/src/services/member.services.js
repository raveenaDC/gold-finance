import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';
import { generatePasswordHash } from '../utils/encryption.helper.js';
import { generateRandomPassword } from '../utils/generate-random-password.helper.js';
import { sendMail } from '../utils/mail.helper.js';
import { createAccountTemplate } from '../registry/mail-templates/create-account.template.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormImageUploadResponseArray = (imageResponseArray) => {
    return imageResponseArray.map((image) => ({
        name: image.originalname,
        fileName: image.filename,
        path: `/cdn/uploads/images/${image.filename}`,
        uploadedDate: new Date(),
    }));
};

export async function viewMembers(req, res) {
    try {

        let { pageLimit, orderBy = 'createdAt', search = null, order } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;
        let sort = {};
        const query = {};
        if (search) {
            query.$or = [
                { name: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let memberSet = await models.memberModel.find(query).select(
            ' name email memberImage role address aadhar phone pin city landMark loginDetails isAccess state createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'name') {
            memberSet.sort((a, b) => a.name.localeCompare(b.name) * order);
        } else if (orderBy === 'date') {
            memberSet.sort((a, b) => a.createdAt.localeCompare(b.createdAt) * order);
        } else {
            memberSet.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
        }

        if (search) {
            // Define a function to calculate relevance score
            const calculateRelevance = (memberSet) => {
                const fields = ['name email'];
                let relevance = 0;
                fields.forEach((field) => {
                    if (
                        memberSet[field] &&
                        memberSet[field].toLowerCase().startsWith(search.toLowerCase())
                    ) {
                        relevance++;
                    }
                });
                return relevance;
            };
            memberSet.sort((a, b) => calculateRelevance(b) - calculateRelevance(a));
        }
        if (!memberSet) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Member(s) not found'
            );
        }
        const paginationResult = await paginateData(memberSet, page, pageLimit);
        //apply orderBy and order
        paginationResult.pagination.orderBy = orderBy;
        paginationResult.pagination.order = order;

        return responseHelper(res, httpStatus.OK, false, 'Member list', {
            items: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch {
        return next(new Error(error));
    }

}

export async function createMember(req, res) {
    try {
        let { name,
            email,
            role,
            address,
            aadhar,
            phone,
            pin,
            city,
            landMark } = req.body;
        let { memberImage } = req.files;

        const memberExist = await models.memberModel.findOne({ email });
        if (memberExist) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'The email is already in use. Please select another one.'
            );
        }

        const passCode = generateRandomPassword();

        const member = await models.memberModel.create({
            name,
            email,
            role,
            password: await generatePasswordHash(passCode),
            address,
            aadhar,
            phone,
            pin,
            city,
            landMark
        });

        if (memberImage && memberImage.length > 0) {
            member.goldImage = transFormImageUploadResponseArray(memberImage)[0];
        }

        const frontendUrl = process.env.FRONTEND_URL + '/auth/login';
        const subject = 'Account created successfully';
        const content = createAccountTemplate(
            name,
            email,
            passCode,
            frontendUrl
        );
        const mailResponse = await sendMail(email, subject, content);

        await member.save();
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Member added successfully',
            member
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function updateMember(req, res) {
    try {
        let { name,
            role,
            address,
            aadhar,
            phone,
            pin,
            city,
            landMark } = req.body;
        let { memberImage } = req.files;
        const { memberId } = req.params;
        let images = {};

        const member = await models.memberModel.findById(memberId);
        if (!member) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Member not found');
        }


        if (
            (memberImage && memberImage[0])
        ) {
            images = {
                item: req.files.memberImage
                    ? transFormImageUploadResponseArray(memberImage)[0]
                    : member.memberImage,
            };
        }

        const updateItem = await models.memberModel.findByIdAndUpdate(
            memberId,
            {
                name,
                role,
                address,
                aadhar,
                phone,
                pin,
                city,
                landMark, memberImage: images.item
            },
            {
                new: true,
            }
        );
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Member is updated successfully',
            { item: updateItem }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function denyMember(req, res) {
    try {
        const { memberId } = req.params
        const { access } = req.body;
        let member = await models.memberModel.findById(memberId);
        if (!member) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Member not found',
            )
        }

        member.isAccess = access
        await member.save();
        let message = ''
        if (access) message = 'Access enabled';
        else message = 'Access denied'
        return responseHelper(
            res, httpStatus.OK,
            false,
            message,
        )

    } catch {
        return next(new Error(error));
    }
}

export async function viewMemberById(req, res) {
    try {
        const { memberId } = req.params
        const member = await models.memberModel.findById(memberId).select(
            'name email memberImage role address aadhar phone pin city landMark loginDetails isAccess state'
        );
        if (!member) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Member not found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'Member details',
            member
        )

    } catch {
        return next(new Error(error));
    }
}