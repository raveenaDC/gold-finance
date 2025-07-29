import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import initializeRoutes from './routes/index.js';
import path from 'path'
import mongoDb from './connection/mongo-db.js';
import { getCurrentWorkingFolder } from './utils/get-current-working-folder.helper.js';
import * as cronFine from './cron-utility/goldLoanFineUtility.js'

dotenv.config();
const app = express();
const port = process.env.PORT || 5000
const dirname = getCurrentWorkingFolder(import.meta.url);

async function main() {
    try {
        await mongoDb.createConnection();

        app.use(express.json());
        app.use(express.urlencoded({ extended: true }));

        // app.use(cors({ origin: '*' }));

        // const cors = require('cors');

        app.use(cors({
            origin: ['https://gold-finance-v554.vercel.app/', 'https://gold-finance.onrender.com']
        }));


        //   Initialize  express.static(path.join(dirname, '../', 'public')) before the app.all('*', ...)  (initializeRoutes(app);)

        app.use('/cdn', express.static(path.join(dirname, '../', 'public')));

        cronFine.cronFineCalculation();

        initializeRoutes(app);

        app.listen(port, (err) => {
            if (!err) { console.log(port, "Port listening successfully") }
            else {
                console.log("Error in listening port", err);
            }
        })
    } catch (error) {
        console.log('something went wrong while starting server....', error);
    }
}

main();
