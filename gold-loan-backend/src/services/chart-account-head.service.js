import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function createdChartAccount(req, res, next) {
    try {
        let {
            accountName,
            category,
            subCategory,
            description,
            debit,
            credit,
            depreciationRateTwo,
            depreciationRateOne
        } = req.body;

        const heads = await models.chartAccountModel.create({
            accountName,
            category,
            subCategory,
            description,
            debit,
            credit,
            depreciationRateTwo,
            depreciationRateOne
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Chart Account Head added successfully',
            heads
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function createReceiptPayment(req, res, next) {
    try {
        let { chartId } = req.params
        let {
            voucherNumber,
            accountName,
            description,
            isPaymentType,
            debit,
            credit,
            amountDate,
            accountType
        } = req.body;

        const chart = await models.chartAccountModel.findOne({ _id: chartId })
        if (!chart) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This account is not exist.',

            );
        }

        const heads = await models.chartAccountTypeModel.create({
            chartId,
            voucherNumber,
            accountName,
            description,
            isPaymentType,
            debit,
            credit,
            amountDate,
            accountType
        });
        let message = isPaymentType == 1 ? 'payment' : 'receipt'
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            `${message} added successfully`,
            heads
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function getChartAccount(req, res, next) {
    try {

        let { search } = req.query;
        const query = {};

        query.$or = [
            { accountName: { $regex: new RegExp(search, 'i') } }
        ];


        let chartList = await models.chartAccountModel.find(query).select(
            'accountName category subCategory description debit  credit depreciationRateTwo  depreciationRateOne createdAt '
        ).collation({ locale: 'en', strength: 2 });

        if (chartList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Char of Account(s) not found..'
            );
        }

        return responseHelper(res, httpStatus.OK, false, 'Chart account list', {
            chartList
        });

    } catch (error) {
        return next(new Error(error));
    }

}

export async function getTotalBalanceAmount(req, res, next) {
    try {
        let { chartId } = req.params
        let value = 0
        const chart = await models.chartAccountTypeModel.find({ chartId: chartId })
        if (chart.length === 0) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                '',
                value
            );
        }
        let sum = 0, total = 0;
        chart.forEach(element => {
            sum += element.debit;
            total += element.credit;
        });
        value = sum === 0 && total === 0 ? 0 : sum === 0 ? total : sum;
        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            `Balance amount`,
            value
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function getGeneralLedger(req, res, next) {
    try {

        let { chartId, financialYearStartDate, financialYearEndDate } = req.body;

        const query = {
            chartId: chartId,
            amountDate: { $gte: financialYearStartDate, $lte: financialYearEndDate },

        };
        let chartList = await models.chartAccountTypeModel.find(query).select(
            'chartId voucherNumber accountName description  credit debit accountType isPaymentType amountDate createdAt '
        ).populate({
            path: 'chartId',
            select: 'category subCategory accountName depreciationRateOne depreciationRateTwo credit debit createdAt'
        }).collation({ locale: 'en', strength: 2 });

        if (chartList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Char of Account(s) not found'
            );
        }

        return responseHelper(res, httpStatus.OK, false, 'Chart account ledger list', {
            ledger: chartList
        });

    } catch (error) {
        return next(new Error(error));
    }

}

export async function getReceiptPayment(req, res, next) {
    try {

        let { financialYearStartDate, financialYearEndDate, accountName, isPaymentType } = req.body;
        let { pageLimit } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        const query = {
            amountDate: { $gte: financialYearStartDate, $lte: financialYearEndDate },
            $or: [
                { accountName: { $regex: new RegExp(accountName, 'i') } },
                { isPaymentType: isPaymentType },
            ],
        };

        let chartList = await models.chartAccountTypeModel.find(query).select(
            'chartId voucherNumber accountName description  credit debit accountType isPaymentType amountDate createdAt '
        ).collation({ locale: 'en', strength: 2 });

        if (chartList.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Char of Account(s) not found'
            );
        }

        const paginationResult = await paginateData(chartList, page, pageLimit);

        return responseHelper(res, httpStatus.OK, false, 'Chart account ledger list', {
            receiptPaymentList: paginationResult.data
        });

    } catch (error) {
        return next(new Error(error));
    }

}

export async function getTrialBalance(req, res, next) {
    try {

        let { financialYearStartDate, financialYearEndDate } = req.body;

        const groupedData = await chartAccountTypeModel.aggregate([
            {
                $match: {
                    amountDate: { $gte: financialYearStartDate, $lte: financialYearEndDate },
                },
            },
            {
                $group: {
                    _id: {
                        chartId: "$chartId",
                        accountName: "$accountName",
                    },
                    totalDebit: { $sum: "$debit" },
                    totalCredit: { $sum: "$credit" },
                },
            },
            {
                $project: {
                    _id: 0,
                    chartId: "$_id.chartId",
                    accountName: "$_id.accountName",
                    totalDebit: 1,
                    totalCredit: 1,
                },
            },
        ]);

        console.log(groupedData);

        return responseHelper(res, httpStatus.OK, false, 'Chart account trial balance list', {
            trialBalance: groupedData
        });


    } catch (error) {
        return next(new Error(error));
    }

}
