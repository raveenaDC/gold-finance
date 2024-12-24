import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function createGoldLoanBilling(req, res, next) {
    try {
        let { goldLoanId,
            billDate,
            billNo,
            interestRate,
            insurance,
            processingFee,
            packingFee,
            appraiser,
            otherCharges,
            totalCharges,
            principlePaid,
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
            insurance,
            processingFee,
            packingFee,
            appraiser,
            otherCharges,
            principleInterestRate: interestRate,
            payment: principlePaid,
            paymentMode
        });

        const fineHistory = await models.fineGoldLoanModel
            .findOne({ goldLoanId })
            .sort({ createdAt: -1 });

        const loanDetails = fineHistory && fineHistory.isFine && fineHistory.balanceAmount != 0
            ? fineHistory
            : existLoan;

        const minusInterestRate = parseFloat(loanDetails.totalInterestRate) - parseFloat(interestRate);
        const minusPrincipleAmount = parseFloat(loanDetails.principleAmount) - parseFloat(principlePaid);
        const newBalanceAmount = parseFloat(minusPrincipleAmount) + parseFloat(minusInterestRate);
        const updatedTotalChargesAndBalance = parseFloat(newBalanceAmount) + parseFloat(totalCharges);

        const updateCharges = (record) => {
            record.insurance = parseFloat(record.insurance) + parseFloat(insurance);
            record.processingFee = parseFloat(record.processingFee) + parseFloat(processingFee);
            record.packingFee = parseFloat(record.packingFee) + parseFloat(packingFee);
            record.appraiser = parseFloat(record.appraiser) + parseFloat(appraiser);
            record.otherCharges = parseFloat(record.otherCharges) + parseFloat(otherCharges);
            record.totalCharges = totalCharges;
            record.totalChargesAndBalanceAmount = updatedTotalChargesAndBalance;
            record.totalInterestRate = minusInterestRate;
            record.balanceAmount = newBalanceAmount;
            record.amountPaid = parseFloat(record.amountPaid) + parseFloat(principlePaid);
        };

        if (fineHistory && fineHistory.isFine) {
            updateCharges(fineHistory);
            await fineHistory.save();
        } else {
            updateCharges(existLoan);
            await existLoan.save();
        }
        if (fineHistory.balanceAmount == 0) {
            fineHistory.isFine = false;
            await fineHistory.save();
        }


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
        let query = { isCanceled: false }
        const goldLoans = await models.goldLoanModel.find({
            glNo: { $regex: new RegExp(search, 'i') }
        }).select('_id');

        const goldLoanIds = goldLoans.map(loan => loan._id);
        query = {
            $or: [
                { billNo: { $regex: new RegExp(search, 'i') } },
                { goldLoanId: { $in: goldLoanIds } }
            ]
        };

        let billDetails = await models.billingModel.find(query)
            .select('goldLoanId principleInterestRate payment paymentMode billDate billNo insurance processingFee packingFee appraise otherCharges createdAt')
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

export async function viewGoldLoanBillingDetails(req, res, next) {
    try {
        let { goldLoanId } = req.params

        let billDetails = await models.billingModel.find({ goldLoanId, isCanceled: false })
            .select('goldLoanId principleInterestRate payment paymentMode billDate insurance processingFee packingFee appraise otherCharges billNo createdAt')
            .populate({
                path: 'goldLoanId',
                select: 'glNo purchaseDate  interestPercentage interestRate  interestMode  insurance processingFee otherCharges packingFee appraiser principleAmount amountPaid',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName primaryNumber email image'
                }
            });

        if (billDetails.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Transaction details are empty'
            );
        }

        return responseHelper(res, httpStatus.OK, false, 'Gold loan transaction list', {
            billData: billDetails
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
            .select('goldLoanId principleInterestRate payment paymentMode billDate insurance processingFee packingFee appraise otherCharges billNo createdAt')
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

export async function cancelBillingDetails(req, res, next) {
    try {
        let { isCanceled } = req.body;
        const { billId } = req.params;

        const bill = await models.goldLoanModel.findById(billId);
        if (!bill) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Bill details not found');
        }

        const updateBillList = await models.billingModel.findByIdAndUpdate(
            billId,
            { isCanceled },
            { new: true, }
        );
        let message;
        if (isCanceled) { message = 'Bill transaction is closed' }
        else { message = 'Bill transaction is opened' }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            message,
            { item: updateBillList }
        );
    } catch (error) {
        return next(new Error(error));
    }

}
