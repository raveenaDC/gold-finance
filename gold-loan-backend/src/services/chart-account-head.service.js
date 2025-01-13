import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function createdChartAccount(req, res, next) {
    try {
        let {
            category,
            subCategory,
            description,
            rate,
            period,
            financialYearStart,
            financialYearEnd
        } = req.body;

        const heads = await models.chartAccountModel.create({
            category,
            subCategory,
            description,
            rate,
            period,
            financialYearStart,
            financialYearEnd
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
            account,
            description,
            isPaymentType,
            debit,
            credit
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
            account,
            description,
            isPaymentType,
            debit,
            credit,
            financialYearStart: chart.financialYearStartDate,
            financialYearEnd: chart.financialYearEndDate
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

        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        const query = {};

        query.$or = [
            { description: { $regex: new RegExp(search, 'i') } },
            { subCategory: { $regex: new RegExp(search, 'i') } },
            { category: { $regex: new RegExp(search, 'i') } }
        ];


        let chartList = await models.chartAccountModel.find(query).select(
            'category subCategory description rate place period financialYearStartDate  financialYearEndDate createdAt '
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

        return responseHelper(res, httpStatus.OK, false, 'Chart account list', {
            items: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch (error) {
        return next(new Error(error));
    }

}
export async function getGeneralLedger(req, res, next) {
    try {

        let { chartId, financialYearStartDate, financialYearEndDate } = req.body;

        const query = {
            chartId: chartId,
            financialYearStartDate: { $gte: new Date(financialYearStartDate) },
            financialYearEndDate: { $lte: new Date(financialYearEndDate) },
        };
        let chartList = await models.chartAccountTypeModel.find(query).select(
            'chartId voucherNumber account description rate credit debit balance financialYearStartDate  financialYearEndDate createdAt '
        ).collation({ locale: 'en', strength: 2 });

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

export async function getTrialBalance(req, res, next) {
    try {

        let { financialYearStartDate, financialYearEndDate } = req.body;
        let trial = [];
        // const query = {
        //     financialYearStartDate: { $gte: new Date(financialYearStartDate) },
        //     financialYearEndDate: { $lte: new Date(financialYearEndDate) },
        // };

        const groupedData = await chartAccountTypeModel.aggregate([
            {
                $match: {
                    financialYearStartDate: { $gte: financialYearStartDate },
                    financialYearEndDate: { $lte: financialYearEndDate },
                },
            },
            {
                $group: {
                    _id: {
                        chartId: "$chartId",
                        account: "$account",
                    },
                    totalDebit: { $sum: "$debit" },
                    totalCredit: { $sum: "$credit" },
                },
            },
            {
                $project: {
                    _id: 0,
                    chartId: "$_id.chartId",
                    account: "$_id.account",
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
