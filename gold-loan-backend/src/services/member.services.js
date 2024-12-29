import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';
import { generatePasswordHash, comparePassword } from '../utils/encryption.helper.js';
import { generateRandomPassword } from '../utils/generate-random-password.helper.js';
import { sendMail } from '../utils/mail.helper.js';
import randomstring from 'randomstring';
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


export async function loginMembers(req, res, next) {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Email or password required',
            )
        }

        let member = await models.memberModel.findOne({ email: email });
        if (!member) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'The email not found',
            )
        }


        let passwordCompare = await comparePassword(password, member.password);
        if (!passwordCompare) {
            return responseHelper(
                res,
                httpStatus.UNAUTHORIZED,
                true,
                'Invalid credentials'
            );
        }
        if (!member.isAccess) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'You have no access to the system.Please contact the administrator'
            );
        }

        let token = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
        });
        member.member_token = token;
        await member.save();
        let userDetails = {
            member_token: token,
            firstName: member.firstName,
            lastName: member.lastName,
            email: member.email,
            role: member.role,
            address: member.address || '',
            aadhar: member.aadhar || '',
            phone: member.phone || '',
            pin: member.pin || '',
            city: member.city || '',
            state: member.state || '',
            landMark: member.landMark || '',
            image: member.memberImage
        }
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Logged in successfully',
            userDetails

        );

    } catch (error) {
        console.log(error);

        return next(new Error(error));
    }
}

export async function logoutMembers(req, res, next) {
    try {
        let { member_token } = req.member;

        if (!member_token) {
            return responseHelper(
                res, httpStatus.BAD_REQUEST,
                true,
                'Invalid request: No member token provided'
            );
        }

        let user = await models.memberModel.findOne({ member_token })
        user.member_token = '';
        await user.save();

        return responseHelper(
            res, httpStatus.OK,
            false,
            'Logout successfully',
        )


    } catch (error) {
        console.log(error);

        return next(new Error(error));
    }
}

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
                { firstName: { $regex: new RegExp(search, 'i') } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ['$firstName', ' ', '$lastName'] },
                            regex: new RegExp(search, 'i')
                        }
                    }
                },
                { lastName: { $regex: new RegExp(search, 'i') } },
                { email: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let memberSet = await models.memberModel.find(query).select(
            ' firstName lastName email memberImage role address aadhar phone pin city landMark  isAccess state createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'firstName') {
            memberSet.sort((a, b) => a.firstName.localeCompare(b.firstName) * order);
        } else if (orderBy === 'lastName') {
            memberSet.sort((a, b) => a.lastName.localeCompare(b.lastName) * order);
        } else if (orderBy === 'date') {
            memberSet.sort((a, b) => a.createdAt.localeCompare(b.createdAt) * order);
        } else {
            memberSet.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
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
        let { firstName,
            lastName,
            email,
            role,
            address,
            aadhar,
            phone,
            pin,
            city,
            state,
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
            firstName,
            lastName,
            email,
            role,
            password: await generatePasswordHash(passCode),
            address,
            aadhar,
            phone,
            pin,
            city,
            state,
            landMark
        });

        if (memberImage && memberImage.length > 0) {
            member.goldImage = transFormImageUploadResponseArray(memberImage)[0];
        }

        let memberName = firstName + ' ' + lastName;
        const frontendUrl = process.env.FRONTEND_URL + '/auth/login';
        const subject = 'Account created successfully';
        const content = createAccountTemplate(
            memberName,
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
        let { firstName,
            lastName,
            role,
            address,
            aadhar,
            phone,
            pin,
            city,
            state,
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
                firstName,
                lastName,
                role,
                address,
                aadhar,
                phone,
                pin,
                state,
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
            'firstName lastName email memberImage role address aadhar phone pin city landMark loginDetails isAccess state'
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