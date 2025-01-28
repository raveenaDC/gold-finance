import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function addPledgeTransactions(req, res, next) {
    try {
        let {
            pledgeNumber,
            pledgeDate,
            bankPledgeNumber,
            bankId,
            interestRate,
            otherCharges,
            dueDate,
            principleAmount,
            glNumber,
            paymentMode,
            itemDetails
        } = req.body;

        const pledgeData = await models.pledgeModel.create({
            pledgeNumber,
            pledgeDate,
            bankPledgeNumber,
            bankId,
            interestRate,
            otherCharges,
            dueDate,
            principleAmount,
            glNumber,
            paymentMode,
            itemDetails
        });

        await models.goldLoanModel.updateMany(
            { _id: { $in: glNumber } },
            { pledgeId: pledgeData._id }
        );
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Pledge details added successfully',
            pledgeData
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function addBankPledgeDetails(req, res, next) {
    try {
        let { bankName,
            interestRate,
            otherCharges,
            duration,
            remark,
        } = req.body;

        let bank = await models.bankPledgeDataModel.find({ bankName: { $regex: new RegExp(bankName, 'i') } });

        if (bank.length > 0) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This bank already exists'
            );
        }

        const bankData = await models.bankPledgeDataModel.create({
            bankName,
            interestRate,
            otherCharges,
            duration,
            remark
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Bank details added successfully',
            bankData
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function getBankName(req, res, next) {
    try {

        let bank = await models.bankPledgeDataModel.find().select('bankName');

        if (bank.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'No bank details found'
            );
        }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Bank list',
            bank
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function pledgeTransactionsBill(req, res, next) {
    try {
        let {
            pledge,
            paidPrinciple,
            paidOtherCharges,
            paidInterest,
            paidAmount
        } = req.body;

        const pledgeData = await models.pledgeTransactionModel.create({
            pledge,
            paidPrinciple,
            paidOtherCharges,
            paidInterest,
            paidAmount
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Pledge transaction added successfully',
            pledgeData
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function getPledgeNumber(req, res, next) {
    try {

        let pledgeNumbers = await models.pledgeModel.find().select('bankPledgeNumber pledgeNumber');

        if (pledgeNumbers.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'No pledge numbers found'
            );
        }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Pledge numbers',
            pledgeNumbers
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function getPledgeDetailsById(req, res, next) {
    try {

        const { pledgeId } = req.params;

        let pledgeNumbers = await models.pledgeModel.findById({ _id: pledgeId }).select('pledgeNumber  pledgeDate bankPledgeNumber bankId interestRate otherCharges dueDate principleAmount glNumber paymentMode itemDetails createdAt')
            .populate({
                path: 'glNumber',
                select: 'glNo purchaseDate customerId',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName '
                },
            }).populate({
                path: 'itemDetails.goldItem', // Path to populate
                select: 'goldItem'   // Fields from the `goldItem` schema to include

            });

        if (pledgeNumbers) {
            pledgeNumbers = pledgeNumbers.toObject(); // Convert Mongoose document to plain JavaScript object

            pledgeNumbers.glNumber = pledgeNumbers.glNumber.map(gl => ({
                _id: gl._id,
                glNo: gl.glNo,
                purchaseDate: gl.purchaseDate,
                customer_id: gl.customerId._id,
                firstName: gl.customerId.firstName,
                lastName: gl.customerId.lastName
            }));

            pledgeNumbers.itemDetails = pledgeNumbers.itemDetails.map(item => ({
                goldItem_id: item.goldItem._id,
                goldItem: item.goldItem.goldItem,
                netWeight: item.netWeight,
                grossWeight: item.grossWeight,
                quantity: item.quantity,
                depreciation: item.depreciation,
                stoneWeight: item.stoneWeight,
                _id: item._id
            }));
        }


        if (pledgeNumbers.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'No pledge numbers found'
            );
        }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Pledge numbers',
            pledgeNumbers
        );
    } catch (error) {
        return next(new Error(error));
    }

}