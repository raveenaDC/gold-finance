import goldItemsRouter from './gold-items.router.js';
import membersRouter from './members.router.js';
import customerRouter from './customer.router.js';
import goldLoanRouter from './gold-loan.router.js'
import loanDocumentRouter from './gold-loan-pdf.router.js'

import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { errorHandleMiddleware } from '../middleware/error-handle.middleware.js';

export default function initializeRoutes(app) {
    // GOLD ITEM ROUTE
    app.use('/gold', goldItemsRouter);

    // MEMBERS ROUTE 
    app.use('/member', membersRouter);

    // CUSTOMER ROUTE 
    app.use('/customer', customerRouter);

    //GOLD LOAN ROUTER
    app.use('/customer/gold', goldLoanRouter);

    //GOLD LOAN DOCUMENT ROUTER
    app.use('/gold/loan', loanDocumentRouter);

    app.use(errorHandleMiddleware);
    //index route
    app.get('/', (req, res) => {
        responseHelper(res, httpStatus.OK, false, 'server is up and running');
    });

    app.all('*', (req, res) => {
        responseHelper(
            res,
            httpStatus.NOT_FOUND,
            true,
            'requested resource not exists'
        );
    });
}
