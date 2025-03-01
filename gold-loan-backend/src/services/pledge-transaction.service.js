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
            itemDetails,
            remarks
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
            itemDetails,
            remarks
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
            pledgeId,
            paidPrinciple,
            paidOtherCharges,
            paidInterest,
            paidAmount,
            remarks,
            transactionDate
        } = req.body;

        let bank = await models.pledgeModel.findById(pledgeId)

        const pledgeData = await models.pledgeTransactionModel.create({
            pledgeId,
            paidPrinciple,
            paidOtherCharges,
            paidInterest,
            paidAmount,
            bankId: bank.bankId,
            remarks,
            transactionDate
        });

        return responseHelper(
            res,
            httpStatus.OK,
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

        let pledgeNumbers = await models.pledgeModel.findById({ _id: pledgeId }).select('pledgeNumber  pledgeDate bankPledgeNumber totalPaidInterest bankId interestRate otherCharges remarks dueDate principleAmount glNumber paymentMode itemDetails createdAt')
            .populate({
                path: 'glNumber',
                select: 'glNo purchaseDate customerId',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName '
                },
            }).populate({
                path: 'itemDetails.goldItem',
                select: 'goldItem'

            }).populate({
                path: 'bankId',
                select: 'bankName'
            });

        if (pledgeNumbers) {
            pledgeNumbers = pledgeNumbers.toObject();
            pledgeNumbers.bankName = pledgeNumbers.bankId.bankName,
                pledgeNumbers.bankId = pledgeNumbers.bankId._id,
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

export async function listPledgeDetails(req, res, next) {
    try {

        let { startDate, endDate, search, pageLimit } = req.body
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        let query = {};
        if (startDate && endDate && !search) {

            query = { pledgeDate: { $gte: startDate, $lte: endDate } };

        }
        else if (search && !(startDate && endDate)) {
            let bankList = await models.bankPledgeDataModel.find({
                bankName: { $regex: new RegExp(search, 'i') }
            }).select('_id');

            let bankIds = bankList.map(bank => bank._id);

            if (bankIds.length > 0) {
                query.$or = [{ bankId: { $in: bankIds } }];
            }
        }

        let pledgeLists = await models.pledgeModel.find(query).select('pledgeNumber  pledgeDate bankPledgeNumber remarks bankId totalPaidPrinciple totalPaidInterest totalPaidPrinciple interestRate otherCharges dueDate principleAmount glNumber paymentMode itemDetails createdAt')
            .populate({
                path: 'glNumber',
                select: 'glNo purchaseDate customerId',
                populate: {
                    path: 'customerId',
                    select: 'firstName lastName '
                },
            }).populate({
                path: 'itemDetails.goldItem',
                select: 'goldItem'
            }).populate({
                path: 'bankId',
                select: 'bankName'
            }).sort({ pledgeDate: -1 });

        if (pledgeLists.length > 0) {
            pledgeLists = pledgeLists.map(pledge => {
                const plainPledge = pledge.toObject();

                return {
                    ...plainPledge,
                    bankName: plainPledge.bankId.bankName,
                    bankId: plainPledge.bankId._id,
                    glNumber: plainPledge.glNumber?.map(item => ({
                        _id: item._id,
                        glNo: item.glNo,
                        purchaseDate: item.purchaseDate,
                        customer_id: item.customerId?._id,
                        firstName: item.customerId?.firstName,
                        lastName: item.customerId?.lastName
                    })) || [],
                    itemDetails: plainPledge.itemDetails?.map(item => ({
                        goldItem_id: item.goldItem?._id,
                        goldItem: item.goldItem?.goldItem,
                        netWeight: item.netWeight,
                        grossWeight: item.grossWeight,
                        quantity: item.quantity,
                        depreciation: item.depreciation,
                        stoneWeight: item.stoneWeight,
                        _id: item._id
                    })) || []
                };
            });
        }

        if (pledgeLists.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'No pledge list found'
            );
        }
        const paginationResult = await paginateData(pledgeLists, page, pageLimit);

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Pledge lists',
            {
                items: paginationResult.data,
                pagination: paginationResult.pagination
            }
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function listPledgeTransaction(req, res, next) {
    try {

        let { startDate, endDate, search, pageLimit, pledgeId } = req.body
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;
        let query = pledgeId ? { pledgeId } : {};

        if (startDate && endDate && !search) {
            query = { createAt: { $gte: startDate, $lte: endDate } };

        }
        else if (search && !(startDate && endDate)) {
            let bankList = await models.bankPledgeDataModel.find({
                bankName: { $regex: new RegExp(search, 'i') }
            }).select('_id');

            let bankIds = bankList.map(bank => bank._id);

            if (bankIds.length > 0) {
                query.$or = [{ bankId: { $in: bankIds } }];
            }
        }

        let pledgeBillLists = await models.pledgeTransactionModel.find(query).select('pledgeId paidPrinciple paidOtherCharges  remarks paidInterest paidAmount bankId createdAt')
            .populate({
                path: 'pledgeId',
                select: 'pledgeNumber pledgeDate bankPledgeNumber pledgeDate',
            }).populate({
                path: 'bankId',
                select: 'bankName'
            }).sort({ createdAt: -1 });

        if (pledgeBillLists.length > 0) {
            pledgeBillLists = pledgeBillLists.map(pledge => {
                const plainPledge = pledge.toObject();

                return {
                    ...plainPledge,
                    bankName: plainPledge.bankId.bankName,
                    bankId: plainPledge.bankId._id,
                    pledgeNumber: plainPledge.pledgeId.pledgeNumber,
                    pledgeId: plainPledge.pledgeId._id,
                    pledgeDate: plainPledge.pledgeId.pledgeDate,
                    bankPledgeNumber: plainPledge.pledgeId.bankPledgeNumber
                };
            });
        }

        if (pledgeBillLists.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'No pledge transaction list found'
            );
        }
        const paginationResult = await paginateData(pledgeBillLists, page, pageLimit);

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Pledge transaction lists',
            {
                items: paginationResult.data,
                pagination: paginationResult.pagination
            }
        );
    } catch (error) {
        return next(new Error(error));
    }

}