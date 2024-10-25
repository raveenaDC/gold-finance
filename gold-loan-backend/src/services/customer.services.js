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

export async function customerView(req, res) {
    try {

        let { pageLimit, orderBy = 'createdAt', search = null, order } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;
        let sort = {};
        const query = {};
        if (search) {
            query.$or = [
                { firstName: { $regex: new RegExp(search, 'i') } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ['$firstName', ' ', '$lastName'] },
                            regex: new RegExp(search, 'i'),
                        },
                    },
                },
                { lastName: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } },
                { primaryNumber: { $regex: new RegExp(search, 'i') } },
                { secondaryNumber: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let customerList = await models.customerModel.find(query).select(
            'firstName lastName  address place state  pin nearBy  primaryNumber careOf secondaryNumber aadhar email image signature createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'firstName') {
            customerList.sort((a, b) => a.firstName.localeCompare(b.firstName) * order);
        } else if (orderBy === 'lastName') {
            customerList.sort((a, b) => a.lastName.localeCompare(b.lastName) * order);
        } else if (orderBy === 'date') {
            customerList.sort((a, b) => a.createdAt.localeCompare(b.createdAt) * order);
        } else {
            customerList.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
        }

        if (search) {
            // Define a function to calculate relevance score
            const calculateRelevance = (memberSet) => {
                const fields = ['firstName lastName email'];
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
            customerList.sort((a, b) => calculateRelevance(b) - calculateRelevance(a));
        }
        if (!customerList) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'customer(s) not found'
            );
        }
        // console.log(customerList);

        const paginationResult = await paginateData(customerList, page, pageLimit);
        //apply orderBy and order
        paginationResult.pagination.orderBy = orderBy;
        paginationResult.pagination.order = order;

        return responseHelper(res, httpStatus.OK, false, 'Customer list', {
            items: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch {
        return next(new Error(error));
    }

}

export async function createCustomer(req, res, next) {
    try {
        let { firstName,
            lastName,
            address,
            place,
            state,
            pin,
            nearBy,
            primaryNumber,
            careOf,
            secondaryNumber,
            aadhar,
            gst,
            email, } = req.body;

        let { image, signature } = req.files;


        const existCustomer = await models.customerModel.findOne({ email: email })
        if (existCustomer) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This email already exist.',

            );
        }
        const member = await models.customerModel.create({
            firstName,
            lastName,
            address,
            place,
            state,
            pin,
            nearBy,
            primaryNumber,
            careOf,
            gst,
            secondaryNumber,
            aadhar,
            email,
        });

        if (signature && signature.length > 0) {
            member.signature = transFormImageUploadResponseArray(signature)[0];
        } if (image && image.length > 0) {
            member.image = transFormImageUploadResponseArray(image)[0];
        }

        await member.save();
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'customer added successfully',
            member
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function updateCustomer(req, res) {
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

// export async function denyMember(req, res) {
//     try {
//         const { memberId } = req.params
//         const { access } = req.body;
//         let member = await models.memberModel.findById(memberId);
//         if (!member) {
//             return responseHelper(
//                 res, httpStatus.NOT_FOUND,
//                 true,
//                 'Member not found',
//             )
//         }

//         member.isAccess = access
//         await member.save();
//         let message = ''
//         if (access) message = 'Access enabled';
//         else message = 'Access denied'
//         return responseHelper(
//             res, httpStatus.OK,
//             false,
//             message,
//         )

//     } catch {
//         return next(new Error(error));
//     }
// }

export async function customerViewById(req, res) {
    try {
        const { memberId } = req.params
        const member = await models.memberModel.findById(memberId).select(
            'firstName lastName  address place state  pin nearBy  primaryNumber careOf secondaryNumber aadhar email image signature createdAt'
        );
        if (!member) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Customer not found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'Customer details',
            member
        )

    } catch {
        return next(new Error(error));
    }
}