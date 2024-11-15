import { Schema, model, Types } from 'mongoose';

const interestCalculationSchema = new Schema(
    {
        interestCalc: {
            type: String,
            default: 'simple',
            enum: ['simple', 'compound'],
        },
        mode: {
            type: String,
            default: 'yearly',
            enum: ['monthly', 'weekly', 'daily', 'annual', 'quarterly'],
        },
        interestRate: {
            type: Number,
            default: 0
        },
        minDays: Number,
        minInterestAmount: {
            type: Number,
            default: 0
        },
        currentGoldRate: {
            type: Number,
            default: 0
        }
    },
    {
        timestamps: true,
        id: false
    }
);

export default model('interestCalculation', interestCalculationSchema);
