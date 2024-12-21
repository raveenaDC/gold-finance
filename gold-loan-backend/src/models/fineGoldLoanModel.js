import { Schema, model, Types } from 'mongoose';

const fineGoldLoanSchema = new Schema(
    {
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'customer' },
        interestPercentage: {
            type: Number,
            default: 0
        },
        interestRate: {
            type: Number,
            default: 0
        },
        interestMode: String,
        totalInterestRate: {
            type: Number,
            default: 0
        },
        processingFee: {
            type: Number,
            default: 0
        },
        packingFee: {
            type: Number,
            default: 0
        },
        insurance: {
            type: Number,
            default: 0
        },
        appraiser: {
            type: Number,
            default: 0
        },
        otherCharges: {
            type: Number,
            default: 0
        },
        principleAmount: {
            type: Number,
            default: 0
        },
        amountPaid: {
            type: Number,
            default: 0,
        },
        balanceAmount: {
            type: Number,
            default: 0,
        },
        totalChargesAndBalanceAmount: {
            type: Number,
            default: 0,
        },
        totalCharges: {
            type: Number,
            default: 0,
        },
        isFine: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        id: false // Disable the `id` virtual field

    }
);

export default model('finedLoan', fineGoldLoanSchema);
