import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;


export async function viewAllGoldLoan(req, res, next) {
    try {

        let { pageLimit, orderBy = 'createdAt', search = null, isClosed, date } = req.query;

        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        const query = {};

        if (date === 'today') {
            const currentDay = new Date();
            currentDay.setHours(23, 59, 59, 999);
            query.purchaseDate = { $lte: currentDay };
        }

        if (isClosed == 'true') {
            query.isClosed = true;
        } else {
            query.isClosed = false;
        }
        if (search) {
            query.$or = [
                { glNo: { $regex: new RegExp(search, 'i') } },
            ];
        }


        let loanList = await models.goldLoanModel.find(query).sort({ purchaseDate: -1 }).select(
            'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage totalCharges isClosed totalChargesAndBalanceAmount interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance  processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt'
        ).populate({
            path: 'itemDetails.goldItem',
            select: 'goldItem'
        }).populate({
            path: 'customerId',
            select: 'firstName lastName image address email primaryNumber'
        }).collation({ locale: 'en', strength: 2 });

        if (loanList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold loan details are empty'
            );
        }

        const loanData = [];
        for (const loan of loanList) {

            let latestBill = await models.billingModel
                .findOne({ goldLoanId: loan._id })
                .sort({ billDate: -1 })
                .lean();

            const fineHistory = await models.fineGoldLoanModel
                .findOne({ goldLoanId: loan._id })
            const loanDetails = fineHistory && fineHistory.isFine && fineHistory.balanceAmount != 0
                ? {
                    totalInterestRate: fineHistory.totalInterestRate,
                    principleAmount: fineHistory.principleAmount,
                    totalChargesAndBalanceAmount: fineHistory.totalChargesAndBalanceAmount,
                    balanceAmount: fineHistory.balanceAmount,
                }
                : {
                    totalInterestRate: loan.totalInterestRate,
                    principleAmount: loan.principleAmount,
                    totalChargesAndBalanceAmount: loan.totalChargesAndBalanceAmount,
                    balanceAmount: loan.balanceAmount,
                };


            loanData.push({
                ...loanDetails,
                glNo: loan.glNo,
                customerData: loan.customerId,
                purchaseDate: loan.purchaseDate,
                voucherNo: loan.voucherNo,
                goldRate: loan.goldRate,
                companyGoldRate: loan.companyGoldRate,
                interestPercentage: loan.interestPercentage,
                interestRate: loan.interestRate,
                totalNetWeight: loan.totalNetWeight,
                interestMode: loan.interestMode,
                insurance: loan.insurance,
                paymentMode: loan.paymentMode,
                processingFee: loan.processingFee,
                packingFee: loan.packingFee,
                appraiser: loan.appraiser,
                otherCharges: loan.otherCharges,
                amountPaid: loan.amountPaid,
                totalCharges: loan.totalCharges,
                profitOrLoss: loan.profitOrLoss,
                goldImage: loan.goldImage,
                isClosed: loan.isClosed,
                goldItemDetails: loan.itemDetails,
                lastTransactionDate: latestBill ? latestBill.billDate : loan.purchaseDate
            });
        }



        const paginationResult = await paginateData(loanData, page, pageLimit);


        return responseHelper(res, httpStatus.OK, false, 'Gold loan list', {
            loanDetails: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch (error) {
        return next(new Error(error));
    }

}
