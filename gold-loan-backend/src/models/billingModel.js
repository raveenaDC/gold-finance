import { Schema, model, Types } from 'mongoose';

const billingSchema = new Schema(
    {
        billNo: String,
        billDate: Date,
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'goldLoan' },
        paymentMode: String,
        isCanceled: {
            type: Boolean,
            default: false
        },
        principleInterestRate: {
            type: Number,
            default: 0
        },
        insurance: {
            type: Number,
            default: 0
        },
        paymentMode: String,
        processingFee: {
            type: Number,
            default: 0
        },
        packingFee: {
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
        payment: {
            type: Number,
            default: 0,
        },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },

    },
    {
        timestamps: true,
        //id: false
    }
);

export default model('billing', billingSchema);
