import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormDocumentUploadResponseArray = (documentResponseArray) => {
    return documentResponseArray.map((document) => ({
        name: document.originalname,
        fileName: document.filename,
        path: `/cdn/uploads/document/${document.filename}`,
        uploadedDate: new Date(),
    }));
};

export async function viewGoldLoanPdf(req, res, next) {
    try {

        let { pageLimit, search = null, startYear, endYear } = req.query;

        pageLimit = parseInt(pageLimit || defaultPageLimit);
        const page = parseInt(req.query.page) || 1;

        const currentDate = new Date();
        let startDate, endDate;

        if (startYear && endYear) {
            startDate = new Date(`${startYear}-03-01`);
            endDate = new Date(`${endYear}-03-31`);
        } else {
            const currentYear = currentDate.getFullYear();
            const currentMonth = currentDate.getMonth() + 1;

            const defaultStartingYear = currentMonth >= 3 ? currentYear : currentYear - 1;
            const defaultEndingYear = defaultStartingYear + 1;

            startDate = new Date(`${defaultStartingYear}-03-01`);
            endDate = new Date(`${defaultEndingYear}-03-31`);
        }

        const query = { createdAt: { $gte: startDate, $lte: endDate } };


        if (search) {
            query.$or = [
                { glNo: { $regex: new RegExp(search, 'i') } },
                { firstName: { $regex: new RegExp(search, 'i') } },
                {
                    $expr: {
                        $regexMatch: {
                            input: { $concat: ['$firstName', ' ', '$lastName'] },
                            regex: new RegExp(search, 'i')
                        }
                    }
                },
                { lastName: { $regex: new RegExp(search, 'i') } }
            ];
        }

        let loanDocuments = await models.goldLoanPdfModel.find(query).select(
            'customerId goldLoanId document createdAt'
        );

        if (loanDocuments.length == 0) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Gold loan documents are empty'
            );
        }

        loanDocuments = await Promise.all(
            loanDocuments.map(async (loan) => {
                const customer = await models.customerModel.findById(loan.customerId).select('firstName lastName primaryNumber email image');
                const goldLoan = await models.goldLoanModel.findById(loan.goldLoanId).select('isClosed');

                return {
                    ...loan.toObject(),
                    customerName: customer ? `${customer.firstName} ${customer.lastName}` : null,
                    customerEmail: customer ? customer.email : null,
                    customerPhone: customer ? customer.primaryNumber : null,
                    customerImage: customer ? customer.image : null,
                    goldLoanIsClosed: goldLoan ? goldLoan.isClosed : null,
                };
            })
        );

        const paginationResult = await paginateData(loanDocuments, page, pageLimit);

        return responseHelper(res, httpStatus.OK, false, 'Gold loan list', {
            loanDocuments: paginationResult.data,
            pagination: paginationResult.pagination,
        });

    } catch (error) {
        return next(new Error(error));
    }

}

export async function viewGoldLoanPdfByCustomerId(req, res, next) {
    try {
        const { customerId } = req.params
        if (!customerId) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'Customer ID is required',
            )
        }
        const loanDocument = await models.goldLoanPdfModel.find({ customerId: customerId }).select(
            'customerId goldLoanId document createdAt'
        ).populate({
            path: 'customerId',
            select: 'firstName lastName primaryNumber email image'
        }).populate({
            path: 'goldLoanId',
            select: 'isClosed'
        })
        if (!loanDocument) {
            return responseHelper(
                res, httpStatus.NOT_FOUND,
                true,
                'No loan documents are found',
            )
        }
        return responseHelper(
            res, httpStatus.OK,
            false,
            'loan details',
            loanDocument
        )

    } catch (error) {
        return next(new Error(error));
    }
}

export async function addGoldPdf(req, res, next) {
    try {
        let {
            customerId,
            goldLoanId } = req.body;
        let { document } = req.files;

        const docs = await models.goldLoanPdfModel.create({
            customerId,
            goldLoanId
        });

        if (document && document.length > 0) {
            docs.document = transFormDocumentUploadResponseArray(document)[0];
        }
        await docs.save();
        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Data saved as PDF Successfully',
            docs
        );
    } catch (error) {
        console.log(error);
        return next(new Error(error));
    }

}

export async function removePdf(req, res, next) {
    try {
        const { documentId } = req.params

        const document = await models.goldLoanPdfModel.findByIdAndDelete(documentId);
        if (!document) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'Document not found'
            );
        }

        return responseHelper(
            res,
            httpStatus.OK,
            false,
            'Document deleted successfully'
        );

    } catch (error) {
        return next(new Error(error));
    }
}
