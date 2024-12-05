import { query, body } from 'express-validator';
import { removeMulterFiles } from '../utils/fs.helper.js';
import { mimeTypes } from '../registry/mimetype.registry.js';

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
  body('image').custom(async (value, { req }) => {
    if (
      req.files.image &&
      !mimeTypes.IMAGE.includes(req.files.image[0]['mimetype'])
    ) {
      await removeMulterFiles(req.files);
      throw new Error(`only ${mimeTypes.IMAGE.join(',')} are accepted`);
    }

    return true;
  }),
  body('signature').custom(async (value, { req }) => {
    if (
      req.files.signature &&
      !mimeTypes.IMAGE.includes(req.files.signature[0]['mimetype'])
    ) {
      await removeMulterFiles(req.files);
      throw new Error(`only ${mimeTypes.IMAGE.join(',')} are accepted`);
    }

    return true;
  }),
  body('aadharImage').custom(async (value, { req }) => {
    if (
      req.files.aadharImage &&
      !mimeTypes.IMAGE.includes(req.files.aadharImage[0]['mimetype'])
    ) {
      await removeMulterFiles(req.files);
      throw new Error(`only ${mimeTypes.IMAGE.join(',')} are accepted`);
    }

    return true;
  }),
  body('passBookImage').custom(async (value, { req }) => {
    if (
      req.files.passBookImage &&
      !mimeTypes.IMAGE.includes(req.files.passBookImage[0]['mimetype'])
    ) {
      await removeMulterFiles(req.files);
      throw new Error(`only ${mimeTypes.IMAGE.join(',')} are accepted`);
    }

    return true;
  }),
  body('email')
    .if(body('email').exists())
    .matches(/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,}$/)
    .withMessage('Email must be valid'),
  body('secondaryNumber')
    .if(body('secondaryNumber').exists())
    .isNumeric()
    .withMessage('Contact number must be numeric')
    .matches(/^\d{10}$/)
    .withMessage('Secondary number must be a valid 10-digit number'),
  body('aadhar')
    .if(body('aadhar').exists())
    .matches(/^\d{12}$/)
    .withMessage('Aadhar number must be valid'),
  body('bankAccount')
    .if(body('bankAccount').exists())
    .matches(/^\d{9,18}$/)
    .withMessage('Bank account number must be between 9 and 18 digits'),
  body('ifsc')
    .if(body('ifsc').exists())
    .matches(/^[A-Z]{4}0\d{6}$/i)
    .withMessage('IFSC code must be valid (e.g., ABCD0123456)'),
  body('dateOfBirth')
    .if(body('dateOfBirth').exists())
    .notEmpty()
    .withMessage('Date of Birth is required'),
  body('upId')
    .if(body('upId').exists())
    .notEmpty()
    .withMessage('UPID is required')
    .matches(/^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/)
    .withMessage('Invalid UPID format, expected format: username@bank'),
];


