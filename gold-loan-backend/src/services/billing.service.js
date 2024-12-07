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

export async function createGoldLoanBilling(req, res, next) {
    try {
        let { goldLoanId,
            billDate,
            billNo,
            amount,
            paymentMode
        } = req.body;

        const existLoan = await models.goldLoanModel.findById(goldLoanId)
        if (!existLoan) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'This gold loan does not exist.',

            );
        }

        const bill = await models.billingModel.create({
            goldLoanId,
            billDate,
            billNo,
            payment: amount,
            paymentMode
        });
        existLoan.amountPaid = amount;
        await existLoan.save();
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Gold loan bill transaction added successfully',
            bill
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewAllGoldLoanBilling(req, res, next) {
    try {
        let { pageLimit, orderBy = 'createdAt', search = null, order } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        order = order == 'asc' ? 1 : -1;

        const goldLoans = await models.goldLoanModel.find({
            glNo: { $regex: new RegExp(search, 'i') }
        }).select('_id');

        const goldLoanIds = goldLoans.map(loan => loan._id);
        const query = {
            $or: [
                { billNo: { $regex: new RegExp(search, 'i') } },
                { goldLoanId: { $in: goldLoanIds } }
            ]
        };

        let billDetails = await models.billingModel.find(query)
            .select('goldLoanId payment paymentMode billDate billNo createdAt')
            .populate({
                path: 'goldLoanId',
                select: 'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName primaryNumber email image'
                }
            });

        billDetails.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt

        if (billDetails.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Transaction details are empty'
            );
        }

        const paginationResult = await paginateData(billDetails, page, pageLimit);
        //apply orderBy and order
        paginationResult.pagination.orderBy = orderBy;
        paginationResult.pagination.order = order;

        return responseHelper(res, httpStatus.OK, false, 'Gold loan transaction list', {
            billData: paginationResult.data,
            pagination: paginationResult.pagination,
        });
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewGoldLoanBillingById(req, res) {
    try {
        const { billId } = req.params
        if (!billId) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Bill ID is required',
            )
        }
        const bill = await models.billingModel.findById(billId)
            .select('goldLoanId payment paymentMode billDate billNo createdAt')
            .populate({
                path: 'goldLoanId',
                select: 'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName primaryNumber email image'
                }
            });
        if (!bill) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Gold loan transaction not found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'loan transaction details',
            bill
        )

    } catch {
        return next(new Error(error));
    }
}
