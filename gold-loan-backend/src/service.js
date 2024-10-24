import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import * as dotenv from 'dotenv';
import initializeRoutes from './routes/index.js';
import path from 'path'
import { mongoUrl } from './config/db.config.js';
import { getCurrentWorkingFolder } from './utils/get-current-working-folder.helper.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = process.env.PORT || 5000
const dirname = getCurrentWorkingFolder(import.meta.url);

app.use(cors({ origin: '*' }));

mongoose.connect(mongoUrl).then(() => {
    console.log("Mongodb connected successfully");
}).catch((err) => {
    console.log(err, "Not connected to the mongodb");
})

initializeRoutes(app);
app.use('/cdn', express.static(path.join(dirname, '../', 'public'))); //static assets

app.listen(port, (err) => {
    if (!err) { console.log(port, "Port listening successfully") }
    else {
        console.log("Error in listening port", err);
    }
})