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
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        minDays: Number,
        minInterestAmount: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        currentGoldRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        }
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true },
        id: false
    }
);

export default model('interestCalculation', interestCalculationSchema);
