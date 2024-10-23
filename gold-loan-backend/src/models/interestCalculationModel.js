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
        interestRate: Types.Decimal128,
        minDays: Number,
        minInterestAmount: Types.Decimal128,
        currentGoldRate: Types.Decimal128

    },
    { timestamps: true }
);

export default model('interestCalculation', interestCalculationSchema);
