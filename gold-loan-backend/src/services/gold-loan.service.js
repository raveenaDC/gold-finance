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
            'glNo purchaseDate voucherNo goldRate companyGoldRate itemDetails interestPercentage interestRate totalNetWeight interestMode customerId memberId nomineeId paymentMode insurance  processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt'
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

        //BALANCE AMOUNT CALCULATION
        let balancePrice;

        switch (interestMode) {
            case 'monthly':
                balancePrice = parseFloat(principleAmount) + parseFloat(interestCalculation);
                break;
            case 'yearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 12);
                break;
            case 'quarterly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 3);
                break;
            case 'halfyearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 6);
                break;
            case 'days':
                balancePrice = parseFloat(principleAmount) + ((parseFloat(interestCalculation) * 12) / 365);
                break;
            case 'weekly':
                balancePrice = parseFloat(principleAmount) + (((parseFloat(interestCalculation) * 12) / 365) * 7);
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
            otherCharges,
            appraiser,
            principleAmount,
            balanceAmount: cutBalancePrice,
            //currentGoldValue,
            profitOrLoss: profitLossAmount,
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

        //BALANCE AMOUNT CALCULATION
        let balancePrice;

        switch (interestMode) {
            case 'monthly':
                balancePrice = parseFloat(principleAmount) + parseFloat(interestCalculation);
                break;
            case 'yearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 12);
                break;
            case 'quarterly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 3);
                break;
            case 'halfyearly':
                balancePrice = parseFloat(principleAmount) + (parseFloat(interestCalculation) * 6);
                break;
            case 'days':
                balancePrice = parseFloat(principleAmount) + ((parseFloat(interestCalculation) * 12) / 365);
                break;
            case 'weekly':
                balancePrice = parseFloat(principleAmount) + (((parseFloat(interestCalculation) * 12) / 365) * 7);
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



export async function viewGoldLoanById(req, res) {
    try {
        const { loanId } = req.params
        if (!loanId) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Loan ID is required',
            )
        }
        const loan = await models.goldLoanModel.findById(loanId).select(
            'glNo voucherNo purchaseDate totalNetWeight goldRate companyGoldRate itemDetails interestPercentage interestRate interestMode customerId memberId nomineeId paymentMode insurance  processingFee otherCharges packingFee appraiser principleAmount amountPaid balanceAmount currentGoldValue profitOrLoss goldImage createdAt'
        ).populate('itemDetails.goldItem', 'goldItem');
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
