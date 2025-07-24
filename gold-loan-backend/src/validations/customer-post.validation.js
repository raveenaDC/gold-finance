import { body } from 'express-validator';

export default [
    body('firstName')
        .notEmpty()
        .withMessage('First name is required')
        .isLength({ min: 3, max: 30 })
        .withMessage('First name must be between 3 and 30 characters')
        .matches(/^[a-zA-Z\s.]+$/)
        .withMessage('First name is invalid')
        .trim()
        .escape(),

    body('lastName')
        .notEmpty()
        .withMessage('Last name is required')
        .isLength({ min: 1, max: 30 })
        .withMessage('Last name must be between 1 and 30 characters')
        .matches(/^[a-zA-Z\s.]+$/)
        .withMessage('Last name is invalid')
        .trim()
        .escape(),
    body('primaryNumber')
        .notEmpty()
        .withMessage('Primary number required')
        .matches(/^\d{10}$/)
        .withMessage('Primary number must be a valid 10-digit number'),
    body('pin')
        .notEmpty()
        .withMessage('Pin number is required')
        .matches(/^\d{6}$/)
        .withMessage('Pin number must be a valid 6-digit number'),
    body('gender')
        .notEmpty()
        .withMessage('Gender is required')
        .isIn(['male', 'female', 'other'])
        .withMessage('Gender must be one of the following: male, female, or other'),
    body('createdDate')
        .notEmpty()
        .withMessage('Customer created date is required')
];