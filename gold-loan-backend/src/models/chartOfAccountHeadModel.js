import { Schema, model, Types } from 'mongoose';

const charAccountSchema = new Schema(
    {
        category: String,
        subCategory: String,
        description: {
            type: String,
            length: 1000
        },
        rate: {
            type: Number,
            default: 0
        },
        period: {
            type: Number,
        },
        financialYearStartDate: {
            type: Date
        },
        financialYearEndDate: {
            type: Date
        }
    },
    {
        timestamps: true,
    }
);

export default model('chartAccount', charAccountSchema);
