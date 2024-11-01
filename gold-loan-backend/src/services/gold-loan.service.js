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

export async function viewGoldLoan(req, res) {
    try {

        let { pageLimit, orderBy = 'createdAt', search = null, order } = req.query;
        let { customerId } = req.params;

        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;
        let sort = {};
        const query = { customerId: req.params.customerId }; // Search by customerId
        const existCustomer = await models.customerModel.findById({ _id: customerId }).select(
            'firstName lastName  address place state  pin nearBy  primaryNumber careOf secondaryNumber aadhar email image signature createdAt'
        );
        if (!existCustomer) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'Customer not exist.',

            );
        }

        if (search) {
            query.$or = [
                { glNo: { $regex: new RegExp(search, 'i') } },
                // { purchaseDate: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let loanList = await models.goldLoanModel.find(query).select(
            'glNo purchaseDate goldRate companyGoldRate netWeight grossWeight stoneWeight interestRate interestMode itemId customerId memberId nomineeId insurance  processingFee packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'glNo') {
            loanList.sort((a, b) => a.glNo.localeCompare(b.glNo) * order);
        } else if (orderBy === 'date') {
            loanList.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate) * order);
        } else {
            loanList.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
        }

        if (search) {
            // Define a function to calculate relevance score
            const calculateRelevance = (loanSet) => {
                const fields = ['glNo'];
                let relevance = 0;
                fields.forEach((field) => {
                    if (
                        loanSet[field] &&
                        loanSet[field].toLowerCase().startsWith(search.toLowerCase())
                    ) {
                        relevance++;
                    }
                });
                return relevance;
            };
            loanList.sort((a, b) => calculateRelevance(b) - calculateRelevance(a));
        }
        if (loanList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold loan details are empty'
            );
        }
        // console.log(customerList);

        const paginationResult = await paginateData(loanList, page, pageLimit);
        //apply orderBy and order
        paginationResult.pagination.orderBy = orderBy;
        paginationResult.pagination.order = order;

        return responseHelper(res, httpStatus.OK, false, 'Gold loan list', {
            customerDetails: existCustomer,
            loanDetails: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch {
        return next(new Error(error));
    }

}

export async function addGoldLoan(req, res, next) {
    try {
        let {
            goldRate,
            companyGoldRate,
            netWeight,
            grossWeight,
            stoneWeight,
            interestRate,
            interestMode,
            itemId,
            customerId,
            nomineeId,
            insurance,
            processingFee,
            packingFee,
            appraiser,
            memberId,//need to remove
            principleAmount,
            //amountPaid,
            // balanceAmount,
            currentGoldValue,
            // profitOrLoss
        } = req.body;

        let { goldImage } = req.files;
        // let { memberId } = req.user

        const existCustomer = await models.customerModel.findById({ _id: customerId })
        if (!existCustomer) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'Customer not exist.',

            );
        }

        if (memberId == customerId) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                "Cannot choose the same customer as the nominee."
            );
        }
        const loan = await models.goldLoanModel.create({
            glNo: 234,
            purchaseDate: Date.now(),
            goldRate,
            companyGoldRate,
            netWeight,
            grossWeight,
            stoneWeight,
            interestRate,
            interestMode,
            itemId,
            customerId,
            memberId,
            nomineeId,
            insurance,
            processingFee,
            packingFee,
            appraiser,
            principleAmount,
            //amountPaid,
            // balanceAmount,
            currentGoldValue,
            // profitOrLoss
        });

        if (goldImage && goldImage.length > 0) {
            loan.goldImage = transFormImageUploadResponseArray(goldImage)[0];
        }
        await loan.save();
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Customer gold loan added successfully',
            loan
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function updateGoldLoanById(req, res) {
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

        const { customerId } = req.params;
        let images = {}, sign = {};

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

        const updateItem = await models.customerModel.findByIdAndUpdate(
            customerId,
            {
                firstName,
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
                email, image: images.item,
                signature: sign.item
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

export async function viewGoldLoanById(req, res) {
    try {
        const { loanId } = req.params
        const loan = await models.customerModel.findById(loanId).select(
            'glNo purchaseDate goldRate companyGoldRate netWeight grossWeight stoneWeight interestRate interestMode itemId customerId memberId nomineeId insurance  processingFee packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt'
        );
        if (!loan) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Gold loan not found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'loan details',
            loan
        )

    } catch {
        return next(new Error(error));
    }
}