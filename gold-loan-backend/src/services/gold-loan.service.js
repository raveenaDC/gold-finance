import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormImageUploadResponseArray = (imageResponseArray) => {
    return imageResponseArray.map((image) => ({
        name: image.originalname,
        fileName: image.filename,
        path: `/cdn/uploads/images/goldItems/${image.filename}`,
        uploadedDate: new Date(),
    }));
};
const itemArrayMapping = (goldItems) => {
    let itemLists = [];
    for (let key in goldItems) {
        if (key.startsWith('itemDetails[')) {
            const match = key.match(/itemDetails\[(\d+)\]\.(\w+)/);
            if (match) {
                const index = match[1];
                const property = match[2];
                if (!itemLists[index]) {
                    itemLists[index] = {};
                }
                itemLists[index][property] = goldItems[key];
            }
        }
    }
    return itemLists;
};

const findTotalPrinciplePaid = async (goldId) => {
    let billPaid = await models.billingModel.find({ goldLoanId: goldId });
    let principlePaid = billPaid.reduce((total, bill) => {
        return total + (bill.payment || 0);
    }, 0);
    let totalPaidInterest = billPaid.reduce((interest, bill) => {
        return interest + (bill.principleInterestRate || 0);
    }, 0);

    let latestBill = await models.billingModel
        .findOne({ goldLoanId: goldId })
        .sort({ billDate: -1 })
        .lean();

    let lastTransaction = latestBill ? latestBill.billDate : null;

    return { principlePaid, totalPaidInterest, lastTransaction };
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
            'firstName lastName  address place state  pin nearBy  primaryNumber city secondaryNumber aadhar aadharImage dateOfBirth gender upId createdDate passBookImage bankUserName bankAccount ifsc bankName email image signature createdAt'
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
            'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage totalCharges totalChargesAndBalanceAmount interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance  processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage isClosed totalInterestRate createdAt'
        ).populate({
            path: 'itemDetails.goldItem', // Path to populate
            select: 'goldItem'   // Fields from the `goldItem` schema to include
        }).collation({ locale: 'en', strength: 2 });

        if (orderBy === 'glNo') {
            loanList.sort((a, b) => a.glNo.localeCompare(b.glNo) * order);
        } else if (orderBy === 'date') {
            loanList.sort((a, b) => a.purchaseDate.localeCompare(b.purchaseDate) * order);
        } else {
            loanList.sort((a, b) => (a.createdAt - b.createdAt) * order); // Default sorting by createdAt
        }

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
            const fineHistory = await models.fineGoldLoanModel
                .findOne({ goldLoanId: loan._id })
            const loanDetails = fineHistory && fineHistory.isFine && fineHistory.balanceAmount != 0
                ? {
                    purchaseDate: fineHistory.purchaseDate,
                    totalInterestRate: fineHistory.totalInterestRate,
                    principleAmount: fineHistory.principleAmount,
                    totalChargesAndBalanceAmount: fineHistory.totalChargesAndBalanceAmount,
                    balanceAmount: fineHistory.balanceAmount,
                }
                : {
                    purchaseDate: loan.purchaseDate,
                    totalInterestRate: loan.totalInterestRate,
                    principleAmount: loan.principleAmount,
                    totalChargesAndBalanceAmount: loan.totalChargesAndBalanceAmount,
                    balanceAmount: loan.balanceAmount,
                };


            loanData.push({
                ...loanDetails,
                goldLoanId: loan._id,
                glNo: loan.glNo,
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
            });
        }



        const paginationResult = await paginateData(loanData, page, pageLimit);
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
            glNo,
            purchaseDate,
            goldRate,
            voucherNo,
            totalNetWeight,
            companyGoldRate,
            interestPercentage,
            interestMode,
            customerId,
            nomineeId,
            paymentMode,
            insurance,
            processingFee,
            packingFee,
            totalCharges,
            otherCharges,
            appraiser,
            memberId,//need to remove
            principleAmount,
            currentGoldValue,
        } = req.body;
        let { goldImage } = req.files;
        // let { memberId } = req.user

        let itemDetails = await itemArrayMapping(req.body);

        const existCustomer = await models.customerModel.findById({ _id: customerId })
        if (!existCustomer) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'Customer not exist.',

            );
        }

        if (nomineeId == customerId) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                "Cannot choose the same customer as the nominee."
            );
        }

        let profitLossAmount = totalNetWeight * goldRate
        let interestCalculation = principleAmount * (interestPercentage / 100);
        let day = (interestCalculation * 12) / 365;
        //BALANCE AMOUNT CALCULATION
        let balancePrice, tInterestRate;
        let endDate = new Date(purchaseDate);
        switch (interestMode) {
            case 'monthly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                tInterestRate = interestCalculation;
                endDate.setDate(endDate.getDate() + 30);
                break;
            case 'yearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 12);
                tInterestRate = interestCalculation * 12;
                endDate.setDate(endDate.getDate() + 365);
                break;
            case 'quarterly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 90);
                tInterestRate = interestCalculation * 3;
                endDate.setDate(endDate.getDate() + 90);
                break;
            case 'halfyearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 180);
                tInterestRate = interestCalculation * 6;
                endDate.setDate(endDate.getDate() + 180);
                break;
            case 'days':
                balancePrice = parseFloat(principleAmount) + parseFloat(day);
                tInterestRate = day;
                endDate.setDate(endDate.getDate() + 1);
                break;
            case 'weekly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 7);
                tInterestRate = day * 7;
                endDate.setDate(endDate.getDate() + 7);
                break;
            case 'range_one[0-30]':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                tInterestRate = interestCalculation;
                endDate.setDate(endDate.getDate() + 30);
                break;
            case 'range_two[0-30]':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                tInterestRate = interestCalculation;
                endDate.setDate(endDate.getDate() + 30);
                break;
            default:
                throw new Error("Invalid interest mode");
        }
        let cutBalancePrice = parseFloat(balancePrice.toFixed(3));

        const loan = await models.goldLoanModel.create({
            glNo,
            voucherNo,
            purchaseDate,//: new Date().toLocaleDateString('en-GB')
            goldRate,
            totalNetWeight,
            companyGoldRate,
            itemDetails,
            interestPercentage,
            interestRate: interestCalculation,
            interestMode,
            customerId,
            //memberId,
            nomineeId,
            paymentMode,
            insurance,
            processingFee,
            packingFee,
            totalInterestRate: parseFloat(tInterestRate.toFixed(3)),
            otherCharges,
            appraiser,
            totalCharges,
            principleAmount,
            totalChargesAndBalanceAmount: parseFloat(cutBalancePrice) + parseFloat(totalCharges),
            balanceAmount: cutBalancePrice,
            //currentGoldValue,
            profitOrLoss: profitLossAmount,
        });

        if (goldImage && goldImage.length > 0) {
            loan.goldImage = transFormImageUploadResponseArray(goldImage)[0];
        }
        await loan.save();
        if (loan._id) {
            await models.fineGoldLoanModel.create({
                goldLoanId: loan._id,
                purchaseDate: loan.purchaseDate,
                lastDate: endDate,
                interestPercentage,
                interestRate: interestCalculation,
                interestMode,
                insurance,
                processingFee,
                packingFee,
                totalInterestRate: parseFloat(tInterestRate.toFixed(3)),
                otherCharges,
                totalCharges,
                appraiser,
                principleAmount,
                totalChargesAndBalanceAmount: parseFloat(cutBalancePrice) + parseFloat(totalCharges),
                balanceAmount: cutBalancePrice
            });
        }

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Customer gold loan added successfully',
            loan
        );
    } catch (error) {
        console.log(error);
        return next(new Error(error));
    }

}

export async function updateGoldLoanById(req, res) {
    try {
        let {
            goldRate,
            companyGoldRate,
            interestPercentage,
            interestMode,
            nomineeId,
            insurance,
            totalNetWeight,
            processingFee,
            packingFee,
            otherCharges,
            totalCharges,
            appraiser,
            principleAmount,
            paymentMode,
            // currentGoldValue,
        } = req.body;
        const { loanId } = req.params;
        let { goldImage } = req.files;
        let itemDetails = await itemArrayMapping(req.body);


        let images = {};

        const loan = await models.goldLoanModel.findById(loanId);
        if (!loan) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Loan details not found');
        }


        if (
            (goldImage && goldImage[0])
        ) {
            images = {
                item: req.files.goldImage
                    ? transFormImageUploadResponseArray(goldImage)[0]
                    : loan.goldImage,
            };
        }
        let profitLossAmount = totalNetWeight * goldRate
        let interestCalculation = principleAmount * (interestPercentage / 100);
        let day = (interestCalculation * 12) / 365;
        //BALANCE AMOUNT CALCULATION
        let balancePrice;

        switch (interestMode) {
            case 'monthly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                break;
            case 'yearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 12);
                break;
            case 'quarterly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 90);
                break;
            case 'halfyearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 180);
                break;
            case 'days':
                balancePrice = parseFloat(principleAmount) + parseFloat(day);
                break;
            case 'weekly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 7);
                break;
            case 'range_one[0-30]':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                break;
            case 'range_two[0-30]':
                balancePrice = parseFloat(principleAmount) + (parseFloat(day) * 30);
                break;
            default:
                throw new Error("Invalid interest mode");
        }
        let cutBalancePrice = parseFloat(balancePrice.toFixed(3));

        const updateGoldList = await models.goldLoanModel.findByIdAndUpdate(
            loanId,
            {
                goldRate,
                companyGoldRate,
                itemDetails,
                interestPercentage,
                interestRate: interestCalculation,
                interestMode,
                paymentMode,
                nomineeId,
                insurance,
                processingFee,
                totalNetWeight,
                packingFee,
                otherCharges,
                appraiser,
                totalChargesAndBalanceAmount: parseFloat(balanceAmount) + parseFloat(totalCharges),
                principleAmount,
                balanceAmount: cutBalancePrice,
                //currentGoldValue,
                profitOrLoss: profitLossAmount,
                goldImage, image: images.item,
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
            { item: updateGoldList }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function updateGoldStatus(req, res, next) {
    try {
        let { isClosed } = req.body;
        const { loanId } = req.params;

        const loan = await models.goldLoanModel.findById(loanId);
        if (!loan) {
            return responseHelper(res, httpStatus.NOT_FOUND, true, 'Loan details not found');
        }

        const updateGoldList = await models.goldLoanModel.findByIdAndUpdate(
            loanId,
            { isClosed },
            { new: true, }
        );
        let message;
        if (isClosed) { message = 'Gold loan closed' }
        else { message = 'Gold loan opened' }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            message,
            { item: updateGoldList }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewGoldLoanById(req, res, next) {
    try {
        const { loanId } = req.params;

        if (!loanId) {
            return responseHelper(
                res,
                httpStatus.BAD_REQUEST,
                true,
                'Loan ID is required'
            );
        }

        const loans = await models.goldLoanModel.findById(loanId);
        if (!loans) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold loan not found'
            );
        }

        const fineHistory = await models.fineGoldLoanModel
            .findOne({ goldLoanId: loanId })
            .sort({ createdAt: -1 });

        const loanDetails = fineHistory && fineHistory.isFine && fineHistory.balanceAmount != 0
            ? {
                purchaseDate: fineHistory.purchaseDate,
                totalInterestRate: fineHistory.totalInterestRate,
                principleAmount: fineHistory.principleAmount,
                totalChargesAndBalanceAmount: fineHistory.totalChargesAndBalanceAmount,
                balanceAmount: fineHistory.balanceAmount,
            }
            : {
                purchaseDate: loans.purchaseDate,
                totalInterestRate: loans.totalInterestRate,
                principleAmount: loans.principleAmount,
                totalChargesAndBalanceAmount: loans.totalChargesAndBalanceAmount,
                balanceAmount: loans.balanceAmount,
            };

        const goldItemIds = loans.itemDetails.map((item) => item.goldItem);

        const goldItems = await models.goldItemModel.find({ _id: { $in: goldItemIds } });

        const enrichedItemDetails = loans.itemDetails.map((item) => {
            const goldItemDetails = goldItems.find(
                (goldItem) => goldItem._id.toString() === item.goldItem.toString()
            );

            return {
                ...item.toObject(),
                goldItemDetails,
            };
        });

        let fineDetails = await models.fineGoldLoanModel.find({ goldLoanId: loanId })

        const loanData = {
            ...loanDetails,
            glNo: loans.glNo,
            voucherNo: loans.voucherNo,
            goldRate: loans.goldRate,
            companyGoldRate: loans.companyGoldRate,
            interestPercentage: loans.interestPercentage,
            interestRate: loans.interestRate,
            totalNetWeight: loans.totalNetWeight,
            interestMode: loans.interestMode,
            itemDetails: enrichedItemDetails,
            customerId: loans.customerId,
            memberId: loans.memberId,
            nomineeId: loans.nomineeId,
            insurance: loans.insurance,
            paymentMode: loans.paymentMode,
            processingFee: loans.processingFee,
            packingFee: loans.packingFee,
            nextDueDate: loans.nextDueDate,
            appraiser: loans.appraiser,
            otherCharges: loans.otherCharges,
            amountPaid: loans.amountPaid,
            totalCharges: loans.totalCharges,
            currentGoldValue: loans.currentGoldValue,
            profitOrLoss: loans.profitOrLoss,
            goldImage: loans.goldImage,
            isClosed: loans.isClosed,
            fineDetails: fineDetails
        };

        const { principlePaid, totalPaidInterest, lastTransaction } = await findTotalPrinciplePaid(loans._id);
        const balancePrincipleAmount = parseFloat(loanDetails.principleAmount) - parseFloat(principlePaid);

        let lastTransactionDate = lastTransaction || loanDetails.purchaseDate;
        let balanceInterest = parseFloat(loanDetails.totalInterestRate) - parseFloat(totalPaidInterest)

        let goldIssuedDays = Math.ceil((new Date() - loanDetails.purchaseDate) / (1000 * 60 * 60 * 24)) - 1

        const loan = {
            ...loanData,
            principlePaid,
            totalPaidInterest,
            balanceInterest: balanceInterest,
            lastTransaction: lastTransactionDate,
            balancePrincipleAmount,
            NumberOfDays: goldIssuedDays
        };

        // Send response
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Loan details retrieved successfully',
            loan
        );
    } catch (error) {
        return next(new Error(error.message || 'An error occurred while fetching loan details.'));
    }
}

//view gold loan by gold number

export async function viewGoldLoanByGoldNumber(req, res, next) {
    try {

        let { search } = req.query;
        let query = {}

        if (search) {
            query.$or = [
                { glNo: { $regex: new RegExp(search, 'i') } },
            ];
        }

        let loanList = await models.goldLoanModel.find(query).select(
            'glNo purchaseDate customerId createdAt'
        ).collation({ locale: 'en', strength: 2 });

        if (loanList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold loan details are empty'
            );
        }
        // console.log(customerList);

        return responseHelper(res, httpStatus.OK, false, 'Gold loan list', {
            loanDetails: loanList,
        });

    } catch (error) {
        return next(new Error(error));
    }

}
