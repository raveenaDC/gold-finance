import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function addPledgeTransactions(req, res, next) {
    try {
        let { pledgeNumber,
            bankPledgeDataModel,
            bankPledgeNumber,
            bankId,
            principleAmount,
            glNumber,
            paymentMode,
            itemDetails,
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
            'Bank details added successfully',
            bank
        );
    } catch (error) {
        return next(new Error(error));
    }

}