import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';

export async function createBasicPlan(req, res, next) {
    try {
        let { planName,
            interestPlan,
            interestRate,
            minimumDays,
            minimumAmount,
            interestType
        } = req.body;

        const existPlan = await models.basicPlansModel.findOne({ planName: planName });
        if (existPlan) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This plan name already exist.',

            );
        }

        const existType = await models.basicPlansModel.findOne({ interestPlan: interestPlan, interestType: interestType, interestRate: interestRate })
        if (existType) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'This plan type already exist.',
            );
        }
        if ((interestPlan === "yearly" && interestType !== "simple" || (interestPlan !== "yearly" && interestType === "simple"))) {
            return responseHelper(
                res,
                httpStatus.CONFLICT,
                true,
                'Please choose the correct interest plan',
            );
        }
        const plan = await models.basicPlansModel.create({
            planName,
            interestPlan,
            interestRate,
            minimumDays,
            minimumAmount,
            interestType

        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Basic plan added successfully.',
            plan
        );
    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewAllBasicPlan(req, res, next) {
    try {
        let basicPlan = await models.basicPlansModel.find().sort({ createdAt: -1 })

        if (basicPlan.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Basic plans are empty.'
            );
        }

        return responseHelper(res, httpStatus.OK, false, 'Basic plan lists', basicPlan);
    } catch (error) {
        return next(new Error(error));
    }
}

export async function deleteBasicPlan(req, res, next) {
    try {
        const { planId } = req.body
        if (!planId) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'plan id is required',
            )
        }
        const plan = await models.basicPlansModel.findById(planId)
        if (!plan) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'The paln not found',
            )
        }
        await models.basicPlansModel.findByIdAndDelete({ _id: planId })
        return responseHelper(
            res, httpStatus.OK,
            false,
            'Plan deleted',
            ""
        )

    } catch (error) {
        return next(new Error(error));
    }
}

