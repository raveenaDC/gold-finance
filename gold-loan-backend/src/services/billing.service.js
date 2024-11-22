import * as models from '../models/index.js'
import httpStatus from 'http-status';
import { responseHelper } from '../utils/response.helper.js';
import { paginateData } from '../utils/pagination-data.js';

const defaultPageLimit = process.env.PAGE_LIMIT;

const transFormImageUploadResponseArray = (imageResponseArray) => {
    return imageResponseArray.map((image) => ({
        name: image.originalname,
        fileName: image.filename,
        path: `/cdn/uploads/images/${image.filename}`,
        uploadedDate: new Date(),
    }));
};

export async function createGoldLoanBilling(req, res, next) {
    try {
        let { goldLoanId,
            billDate,
            billNo,
        } = req.body;

        const existLoan = await models.goldLoanModel.findById(goldLoanId)
        if (!existLoan) {
            return responseHelper(
                res,
                httpStatus.NOT_FOUND,
                true,
                'This gold loan does not exist.',

            );
        }

        const bill = await models.billingModel.create({
            goldLoanId,
            billDate,
            billNo
        });

        return responseHelper(
            res,
            httpStatus.CREATED,
            false,
            'Gold loan bill transaction added successfully',
            bill
        );
    } catch (error) {
        return next(new Error(error));
    }

}

