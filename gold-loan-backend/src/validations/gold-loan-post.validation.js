import { body } from 'express-validator';

export default [
    body('glNo')
        .notEmpty()
        .withMessage('Gold number is required'),
    body('voucherNo')
        .notEmpty()
        .withMessage('Voucher number is required'),
    body('goldRate')
        .notEmpty()
        .withMessage('Gold rate is required'),
    body('companyGoldRate')
        .notEmpty()
        .withMessage('Company gold rate is required'),
    body('interestRate')
        .notEmpty()
        .withMessage('Interest rate number is required'),
    body('interestMode')
        .notEmpty()
        .withMessage('Interest mode number is required'),
    body('nomineeId')
        .notEmpty()
        .withMessage('Nominee is required'),
    body('paymentMode')
        .notEmpty()
        .withMessage('Payment mode is required'),
    body('principleAmount')
        .notEmpty()
        .withMessage('Principle amount number is required'),
];