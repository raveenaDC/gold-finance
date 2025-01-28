import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

export async function createAdditionalSettings(req, res, next) {
    try {
        let {
            insurance,
            processingFee,
            packingFee,
            appraiser,
            firstLetter,
            secondLetter
        } = req.body;

        const charges = await models.additionalChargesModel.create({
            firstLetter,
            secondLetter,
            insurance,
            processingFee,
            packingFee,
            appraiser
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Additional charges added successfully',
            charges
        );
    } catch (error) {
        return next(new Error(error));
    }

}
export async function createRateSettings(req, res, next) {
    try {
        let {
            settingsDate,
            goldRate,
            companyGoldRate
        } = req.body;
        const { member_id } = req.member;

        const bill = await models.interestSettingsModel.create({
            settingsDate,
            goldRate,
            companyGoldRate,
            memberId: member_id
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Rate settings added successfully',
            bill
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewAllRateSettings(req, res, next) {
    try {
        let { pageLimit } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        let rate = await models.interestSettingsModel.find()
            .select('settingsDate goldRate companyGoldRate memberId createdAt')
            .populate({
                populate: {
                    path: 'memberId',
                    select: 'firstName lastName primaryNumber email image'
                }
            }).sort({ settingsDate: -1 });


        if (rate.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Rate settings details are empty'
            );
        }

        const paginationResult = await paginateData(rate, page, pageLimit);

        return responseHelper(res, httpStatus.OK, false, 'Rate settings list', {
            rateSettings: paginationResult.data,
            pagination: paginationResult.pagination,
        });
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewAllAdditionalSettings(req, res, next) {
    try {
        let { pageLimit } = req.query;
        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        let charges = await models.additionalChargesModel.find()
            .select('firstLetter secondLetter insurance processingFee packingFee appraiser createdAt').sort({ createdAt: -1 });

        if (charges.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Additional charges details are empty'
            );
        }

        const paginationResult = await paginateData(charges, page, pageLimit);

        return responseHelper(res, httpStatus.OK, false, 'Additional rating settings list', {
            chargesSettings: paginationResult.data,
            pagination: paginationResult.pagination,
        });
    } catch (error) {
        return next(new Error(error));
    }

}



