import { query } from 'express-validator';
export default [
    query('order')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage("order must be any of 'asc' 'desc' "),
    query('orderBy')
        .optional()
        .isIn(['firstName', 'lastName', 'date'])
        .withMessage(
            "order must be any of  'firstName'  'lastName' 'date'"
        ),
    query('startYear')
        .optional()
        .custom((value, { req }) => {
            if (value && !req.query.endYear) {
                throw new Error('endYear is required when startYear is provided');
            }
            return true;
        }),
    query('endYear')
        .optional()
        .custom((value, { req }) => {
            if (value && !req.query.startYear) {
                throw new Error('startYear is required when endYear is provided');
            }
            return true;
        }),
]