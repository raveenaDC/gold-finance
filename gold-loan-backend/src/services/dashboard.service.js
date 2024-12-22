import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';

export async function homePageDataCounts(req, res, next) {
    try {
        //total customers
        const customer = await models.customerModel.find();
        //total  active customers
        const activeCustomers = await models.goldLoanModel.find({ isClosed: false });
        let active = activeCustomers.map(customer => customer.customerId.toString());
        let uniqueArray = [...new Set(active)];

        //total  Inactive customers
        const inactiveCustomers = await models.goldLoanModel.find({ isClosed: true });
        let inactive = inactiveCustomers.map(customer => customer.customerId.toString());
        let inactiveArray = [...new Set(inactive)];

        //issued gl in 00-30
        let endDate = new Date();
        let startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1);

        let glCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: startDate, $lte: endDate }
        });
        let sum = 0;

        glCountMonth.forEach(amount => {
            sum += amount.principleAmount;
        });

        //issued gl in 30-60
        let endMonth = new Date();
        endMonth.setMonth(endMonth.getMonth() - 1);

        let startMonth = new Date(endMonth);
        startMonth.setMonth(endMonth.getMonth() - 1);

        let glCountSecondMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: startMonth, $lte: endMonth }
        });

        let total = 0;

        glCountMonth.forEach(amount => {
            total += amount.principleAmount;
        });

        //closed gl in 00-30
        let closeEndDate = new Date();
        let closeStartDate = new Date();
        closeStartDate.setMonth(closeStartDate.getMonth() - 1);

        let closeGlCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: closeStartDate, $lte: closeEndDate }, isClosed: true
        });

        let closeTotal = 0;

        glCountMonth.forEach(amount => {
            closeTotal += amount.principleAmount;
        });


        //closed gl in 30-60
        let secondEndMonth = new Date();
        secondEndMonth.setMonth(secondEndMonth.getMonth() - 1);

        let secondStartMonth = new Date(secondEndMonth);
        secondStartMonth.setMonth(secondEndMonth.getMonth() - 1);

        let closeGlCountSecondMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: secondStartMonth, $lte: secondEndMonth }, isClosed: true
        });

        let closeSum = 0;

        glCountMonth.forEach(amount => {
            closeSum += amount.principleAmount;
        });

        //six month issued account 00-180

        let sixEndDate = new Date();
        let sixStartDate = new Date();
        sixStartDate.setMonth(sixStartDate.getMonth() - 6);

        let sixGlCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: sixStartDate, $lte: sixEndDate }
        });

        //six month closed account 00-180

        let sixCloseEndDate = new Date();
        let sixCloseStartDate = new Date();
        sixCloseStartDate.setMonth(sixCloseStartDate.getMonth() - 6);

        let sixCloseGlCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: sixCloseStartDate, $lte: sixCloseEndDate }, isClosed: true
        });

        //six month issued month amount 00-180

        let sixAmountEndDate = new Date(); Amount
        let sixAmountStartDate = new Date();
        sixStartDate.setMonth(sixStartDate.getMonth() - 6);

        let sixAmountGlCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: sixAmountStartDate, $lte: sixAmountEndDate }
        });

        let amountSum = 0;

        glCountMonth.forEach(amount => {
            amountSum += amount.principleAmount;
        });

        //six month closed amount month 00-180

        let sixMonthCloseEndDate = new Date();
        let sixMonthCloseStartDate = new Date();
        sixMonthCloseStartDate.setMonth(sixMonthCloseStartDate.getMonth() - 6);

        let sixMonthCloseGlCountMonth = await models.goldLoanModel.find({
            purchaseDate: { $gte: sixMonthCloseStartDate, $lte: sixMonthCloseEndDate }, isClosed: true
        });
        let closedAmountSum = 0;

        glCountMonth.forEach(amount => {
            closedAmountSum += amount.principleAmount;
        });

        //six month issued Customer 00-180

        let sixCustomerEndDate = new Date();
        let sixCustomerStartDate = new Date();
        sixCustomerStartDate.setMonth(sixCustomerStartDate.getMonth() - 6);

        let sixCustomerGlCountMonth = await models.customerModel.find({
            createdDate: { $gte: sixCustomerStartDate, $lte: sixCustomerEndDate }
        });

        //six month active customer 00-180

        let sixCustomerCloseEndDate = new Date();
        let sixCustomerCloseStartDate = new Date();
        sixCustomerCloseStartDate.setMonth(sixCustomerCloseStartDate.getMonth() - 6);

        let sixCustomerCloseGlCountMonth = await models.goldLoanModel.find({
            createdDate: { $gte: sixCustomerCloseStartDate, $lte: sixCustomerCloseEndDate }, isClosed: false
        });

        let customerActive = sixCustomerCloseGlCountMonth.map(customer => customer.customerId.toString());
        let customerUniqueArray = [...new Set(customerActive)];
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Counts',
            {
                userCount: customer.length || 0,
                activeCustomer: uniqueArray.length || 0,
                inactiveCustomer: inactiveArrayArray.length || 0
            }

        );

    } catch (error) {
        return next(new Error(error));
    }
}