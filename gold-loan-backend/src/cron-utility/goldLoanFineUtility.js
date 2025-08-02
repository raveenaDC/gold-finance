import cron from 'node-cron';
import * as models from '../models/index.js';


export async function cronFineCalculation() {
    cron.schedule('0 0 * * *', async () => {
        try {
            const goldLoans = await models.goldLoanModel.find();

            const interestModes = {
                daily: 1,
                weekly: 7,
                monthly: 30,
                quarterly: 90,
                halfyearly: 180,
                yearly: 365,
            };

            for (const loan of goldLoans) {
                const currentDate = new Date();

                const modeDays = interestModes[loan.interestMode];
                if (!modeDays) {
                    console.error(`Invalid interest mode: ${loan.interestMode}`);
                    continue;
                }

                let payLoanDate = loan.purchaseDate;
                let latestLoanAmount = loan.balanceAmount;
                if (loan.nextDueDate) {
                    payLoanDate = loan.nextDueDate;
                    const fineLoan = await models.fineGoldLoanModel
                        .findOne({ goldLoanId: loan._id })
                        .sort({ createdAt: -1 });
                    latestLoanAmount = fineLoan ? fineLoan.balanceAmount : loan.balanceAmount;
                }

                const nextDueDate = new Date(payLoanDate);
                nextDueDate.setDate(nextDueDate.getDate() + modeDays);

                if (currentDate > nextDueDate && latestLoanAmount > 0) {
                    const interestCalculations = latestLoanAmount * (loan.interestPercentage / 100);
                    let interestCalculation = interestCalculations.toFixed(2);
                    const dailyInterest = ((interestCalculation) / 365).toFixed(2);
                    let fineBalancePrice = 0;
                    let totalInterestRate = 0;

                    switch (loan.interestMode) {
                        case 'monthly':
                            fineBalancePrice = latestLoanAmount + dailyInterest * 30;
                            totalInterestRate = dailyInterest * 30;
                            break;

                        case 'quarterly':
                            fineBalancePrice = latestLoanAmount + dailyInterest * 90;
                            totalInterestRate = dailyInterest * 90;
                            break;

                        case 'halfyearly':
                            fineBalancePrice = latestLoanAmount + dailyInterest * 180;
                            totalInterestRate = dailyInterest * 180;
                            break;

                        case 'yearly':
                            fineBalancePrice = latestLoanAmount + interestCalculation * 12;
                            totalInterestRate = dailyInterest * 365;
                            break;

                        case 'weekly':
                            fineBalancePrice = latestLoanAmount + dailyInterest * 7;
                            totalInterestRate = dailyInterest * 7;
                            break;

                        case 'daily':
                            fineBalancePrice = latestLoanAmount + dailyInterest;
                            totalInterestRate = dailyInterest;
                            break;

                        default:
                            console.error(`Unhandled interest mode: ${loan.interestMode}`);
                            continue;
                    }

                    fineBalancePrice = parseFloat(fineBalancePrice.toFixed(2));

                    await models.fineGoldLoanModel.create({
                        goldLoanId: loan._id,
                        purchaseDate: payLoanDate,
                        lastDate: nextDueDate,
                        interestPercentage: loan.interestPercentage,
                        interestRate: interestCalculation,
                        interestMode: loan.interestMode,
                        insurance: loan.insurance,
                        processingFee: loan.processingFee,
                        packingFee: loan.packingFee,
                        totalInterestRate,
                        otherCharges: loan.otherCharges,
                        totalCharges: loan.totalCharges,
                        appraiser: loan.appraiser,
                        principleAmount: latestLoanAmount,
                        totalChargesAndBalanceAmount: fineBalancePrice + parseFloat(loan.totalCharges),
                        balanceAmount: fineBalancePrice,
                        isFine: true
                    });

                    loan.nextDueDate = nextDueDate;
                    await loan.save();

                }
            }
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    })
}