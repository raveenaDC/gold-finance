import cron from 'node-cron';
import * as models from '../models/index.js'

export async function cronFineCalculation() {
    console.log('Cron job triggered');
    let goldLoans = await models.goldLoanModel.find();
    goldLoans.forEach(loan => {
        console.log(`Balance Amount: ${loan.balanceAmount}`);
    });

    cron.schedule('0 0 * * *', async () => {
        try {
            console.log('Cron job triggered');
            let goldLoans = await models.goldLoanModel.find();
            goldLoans.forEach(loan => {
                console.log(`Balance Amount: ${loan.balanceAmount}`);
            });
        } catch (error) {
            console.error('Error in cron job:', error);
        }
    });
}