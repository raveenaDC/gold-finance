import { body } from 'express-validator';

export default [
    body('isApproved')
        .notEmpty()
        .withMessage('Approval status must be is required')
        .isInt({ min: 0, max: 1 }).withMessage('Value must be 0 or 1 ')
];