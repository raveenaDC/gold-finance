import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormImageUploadResponseArray = (imageResponseArray) => {
    return imageResponseArray.map((image) => ({
        name: image.originalname,
        fileName: image.filename,
        path: `/cdn/uploads/images/${image.filename}`,
        uploadedDate: new Date(),
    }));
};

export async function customerView(req, res, next) {
    try {

        let { pageLimit, orderBy = 'createdAt', order, phone, firstName, lastName, location, address, startYear, endYear } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;
        const currentDate = new Date();
        let startDate, endDate;
        let sort = {};

        // Sort by financial year
        let query = {};

        if (startYear && endYear) {
            const startDate = new Date(`${startYear}-04-01T00:00:00.000Z`);
            const endDate = new Date(`${endYear}-03-31T23:59:59.999Z`);

            query.createdAt = { $gte: startDate, $lte: endDate };
        }

        if (phone && address && location && firstName && lastName) {
            query.$and = [
                { address: { $regex: new RegExp(address, 'i') } },
                { place: { $regex: new RegExp(location, 'i') } },
                { city: { $regex: new RegExp(location, 'i') } },
                { firstName: { $regex: new RegExp(firstName, 'i') } },
                { lastName: { $regex: new RegExp(lastName, 'i') } },
                {
                    $or: [
                        { primaryNumber: { $regex: new RegExp(phone, 'i') } },
                        { secondaryNumber: { $regex: new RegExp(phone, 'i') } }
                    ]
                }
            ];
        } else {
            let conditions = [];

            if (phone) {
                conditions.push(
                    { primaryNumber: { $regex: new RegExp(phone, 'i') } },
                    { secondaryNumber: { $regex: new RegExp(phone, 'i') } }
                );
            }
            if (location) {
                conditions.push(
                    { city: { $regex: new RegExp(location, 'i') } },
                    { place: { $regex: new RegExp(location, 'i') } }
                );
            }
            if (address) {
                conditions.push({ address: { $regex: new RegExp(address, 'i') } });
            }
            if (firstName) {
                conditions.push({ firstName: { $regex: new RegExp(firstName, 'i') } });
            }
            if (lastName) {
                conditions.push({ lastName: { $regex: new RegExp(lastName, 'i') } });
            }

            if (conditions.length > 0) {
                query.$or = conditions;
            }
        }

        let customerList = await models.customerModel.find().select(
            'firstName lastName  address district place state rating  pin nearBy  primaryNumber dateOfBirth gender upId createdDate passBookImage city secondaryNumber totalCharges panCardName panCardNumber aadhar email image signature aadharImage bankUserName bankAccount ifsc bankName createdAt '
        ).collation({ locale: 'en', strength: 2 }).sort({ createdDate: -1 });
        if (customerList.length == 0) {
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

    } catch (error) {
        return next(new Error(error));
    }

}

export async function createCustomer(req, res, next) {
    try {
        let { firstName,
            lastName,
            address,
            place,
            district,
            state,
            pin,
            nearBy,
            primaryNumber,
            city,
            secondaryNumber,
            aadhar,
            gst,
            email,
            dateOfBirth,
            gender,
            upId,
            totalCharges, panCardName, panCardNumber,
            createdDate,
            bankUserName,
            bankAccount,
            ifsc,
            bankName } = req.body;

        let { image, signature, aadharImage, passBookImage } = req.files;

        const existCustomer = await models.customerModel.findOne({ email: email })
        if (existCustomer) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This email already exist.',

            );
        }
        const existPrimePhone = await models.customerModel.findOne({ primaryNumber })
        if (existPrimePhone) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This phone number already exist.',

            );
        }
        const existSecondaryNumber = await models.customerModel.findOne({ secondaryNumber })
        if (existSecondaryNumber) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This secondary number already exist.',

            );
        }
        const existAadhar = await models.customerModel.findOne({ aadhar: aadhar })
        if (existAadhar) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This aadhar has already exist.',

            );
        }
        const member = await models.customerModel.create({
            firstName,
            lastName,
            address,
            place,
            district,
            state,
            pin,
            nearBy,
            primaryNumber,
            city,
            dateOfBirth,
            gender,
            upId,
            createdDate,
            gst,
            totalCharges, panCardName, panCardNumber,
            secondaryNumber,
            aadhar,
            email,
            bankUserName,
            bankAccount,
            ifsc,
            bankName
        });

        if (signature && signature.length > 0) {
            member.signature = transFormImageUploadResponseArray(signature)[0];
        } if (image && image.length > 0) {
            member.image = transFormImageUploadResponseArray(image)[0];
        } if (aadharImage && aadharImage.length > 0) {
            member.aadharImage = transFormImageUploadResponseArray(aadharImage);
        } if (passBookImage && passBookImage.length > 0) {
            member.passBookImage = transFormImageUploadResponseArray(passBookImage)[0];
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

export async function updateCustomer(req, res, next) {
    try {
        let { firstName,
            lastName,
            address,
            place,
            district,
            state,
            pin,
            nearBy,
            primaryNumber,
            city,
            secondaryNumber,
            aadhar,
            gst,
            dateOfBirth,
            gender,
            upId,
            createdDate,
            rating,
            email,
            totalCharges, panCardName, panCardNumber,
            bankUserName,
            bankAccount,
            ifsc,
            bankName } = req.body;

        let { image, signature, aadharImage, passBookImage } = req.files;

        const { customerId } = req.params;
        let images = {}, sign = {}, document = {}, passBook = {};

        const customer = await models.customerModel.findById(customerId);
        if (!customer) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Customer not found');
        }


        if (
            (image && image[0])
        ) {
            images = {
                item: req.files.image
                    ? transFormImageUploadResponseArray(image)[0]
                    : customer.image,
            };
        }
        if (
            (signature && signature[0])
        ) {
            sign = {
                item: req.files.signature
                    ? transFormImageUploadResponseArray(signature)[0]
                    : customer.signature,
            };
        }
        if (
            (aadharImage && aadharImage[0])
        ) {
            document = {
                item: req.files.aadharImage
                    ? transFormImageUploadResponseArray(aadharImage)
                    : customer.aadharImage,
            };
        }
        if (
            (passBookImage && passBookImage[0])
        ) {
            passBook = {
                item: req.files.passBookImage
                    ? transFormImageUploadResponseArray(passBookImage)[0]
                    : customer.passBookImage,
            };
        }

        const updateItem = await models.customerModel.findByIdAndUpdate(
            customerId,
            {
                firstName,
                lastName,
                address,
                place,
                district,
                state,
                pin,
                nearBy,
                primaryNumber,
                city,
                secondaryNumber,
                aadhar,
                gst,
                totalCharges, panCardName, panCardNumber,
                dateOfBirth,
                gender,
                upId,
                createdDate,
                rating,
                email, image: images.item,
                signature: sign.item,
                aadharImage: document.item,
                bankUserName,
                bankAccount,
                ifsc,
                bankName,
                passBookImage: passBook.item
            },
            {
                new: true,
            }
        );
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Customer is updated successfully',
            { item: updateItem }
        );
    } catch (error) {
        return next(new Error(error));
    }

}



export async function customerViewById(req, res) {
    try {
        const { customerId } = req.params
        if (!customerId) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Customer Id is required',
            )
        }
        const customer = await models.customerModel.findById(customerId).select(
            'firstName lastName  address place district state rating pin nearBy  primaryNumber dateOfBirth gender upId createdDate totalCharges panCardName panCardNumber passBookImage city secondaryNumber aadhar email image signature aadharImage bankUserName bankAccount ifsc  bankName createdAt'
        );
        if (!customer) {
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
            customer
        )

    } catch {
        return next(new Error(error));
    }
}