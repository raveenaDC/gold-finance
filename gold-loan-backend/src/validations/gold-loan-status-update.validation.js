import { body } from 'express-validator';

export default [
    body('isClosed').custom((value) => {
        if (typeof value !== 'boolean') {
            throw new Error("It must be a boolean value ('true' or 'false')");
        }
        return true;
    }),
];