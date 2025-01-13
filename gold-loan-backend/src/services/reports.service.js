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

        if (date) {
            const currentDay = new Date(date);
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
            'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage totalCharges isClosed totalChargesAndBalanceAmount interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance  processingFee otherCharges packingFee appraiser dayAmount principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage totalInterestRate createdAt'
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
        let principlePaid = 0, principleInterest = 0;
        for (const loan of loanList) {

            // Bill Section

            let latestBill = await models.billingModel
                .findOne({ goldLoanId: loan._id })
                .sort({ billDate: -1 })
                .lean();

            let billPaid = await models.billingModel.find({ goldLoanId: loan._id });
            let totalPaidForLoan = billPaid.reduce((total, bill) => {
                return total + (bill.payment || 0);
            }, 0);
            principlePaid += totalPaidForLoan;

            let totalPaidInterest = billPaid.reduce((interest, bill) => {
                return interest + (bill.principleInterestRate || 0);
            }, 0);
            principleInterest += totalPaidInterest;
            // End Bill Section

            //Fine Section

            const fineHistory = await models.fineGoldLoanModel
                .findOne({ goldLoanId: loan._id })
            const loanDetails = fineHistory && fineHistory.isFine && fineHistory.balanceAmount != 0
                ? {
                    purchaseDate: fineHistory.purchaseDate,
                    totalInterestRate: fineHistory.totalInterestRate,
                    principleAmount: fineHistory.principleAmount,
                    dayAmount: fineHistory.dayAmount,
                    totalChargesAndBalanceAmount: fineHistory.totalChargesAndBalanceAmount,
                    balanceAmount: fineHistory.balanceAmount,
                }
                : {
                    purchaseDate: loan.purchaseDate,
                    totalInterestRate: loan.totalInterestRate,
                    principleAmount: loan.principleAmount,
                    dayAmount: loan.dayAmount,
                    totalChargesAndBalanceAmount: loan.totalChargesAndBalanceAmount,
                    balanceAmount: loan.balanceAmount,
                };
            //End Fine Section

            let lastTransactionDate = latestBill ? latestBill.billDate : loanDetails.purchaseDate;
            let balanceInterest = parseFloat(loanDetails.totalInterestRate) - parseFloat(principleInterest)

            let balanceInterestDays, interestDays, interestDaysAmount;
            if (balanceInterest == 0) {
                balanceInterestDays = 0;
            } else {
                //To Find Balance Interest To Pay Till Today
                interestDays = Math.ceil((new Date() - lastTransactionDate) / (1000 * 60 * 60 * 24)) - 1;

                let interestCalculation = loanDetails.principleAmount * (loan.interestPercentage / 100);
                let day = (interestCalculation * 12) / 365;
                if (loan.interestMode == 'yearly') {
                    interestDaysAmount = (interestDays * (interestCalculation * 12))
                }
                else { interestDaysAmount = day * interestDays }

                //Balance Days After Last Interest Paid
                balanceInterestDays = Math.ceil((lastTransactionDate - loanDetails.purchaseDate) / (1000 * 60 * 60 * 24))// + 1;  Add 1 to include the last day

                if (loan.interestMode == 'daily') { balanceInterestDays = 1 - balanceInterestDays }
                else if (loan.interestMode == 'weekly') { balanceInterestDays = 7 - balanceInterestDays }
                else if (loan.interestMode == 'yearly') { balanceInterestDays = 365 - balanceInterestDays }
                else if (loan.interestMode == 'halfyearly') { balanceInterestDays = 180 - balanceInterestDays }
                else if (loan.interestMode == 'quarterly') { balanceInterestDays = 90 - balanceInterestDays }
                else if (loan.interestMode == 'monthly') { balanceInterestDays = 30 - balanceInterestDays }
                else { balanceInterestDays = 30 }
            }

            loanData.push({
                ...loanDetails,
                goldLoanId: loan._id,
                glNo: loan.glNo,
                customerData: loan.customerId,
                // purchaseDate: loan.purchaseDate,
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
                amountPaid_totalPrinciplePaid: principlePaid,
                paidInterest: principleInterest,
                balanceInterest: balanceInterest,
                balanceInterestDays: balanceInterestDays,
                interestTillToday: interestDaysAmount,
                totalCharges: loan.totalCharges,
                profitOrLoss: loan.profitOrLoss,
                goldImage: loan.goldImage,
                isClosed: loan.isClosed,
                goldItemDetails: loan.itemDetails,
                lastTransactionDate: lastTransactionDate
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
