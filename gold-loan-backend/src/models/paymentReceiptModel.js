import { Schema, model, Types } from 'mongoose';

const paymentReceiptSchema = new Schema(
    {
        chartId: { type: Schema.Types.ObjectId, ref: 'chartAccount' },
        voucherNumber: String,
        account: String,
        description: {
            type: String,
            length: 1000
        },
        isPaymentType: {
            type: Boolean,
            default: 0
        },
        debit: {
            type: Number,
            default: 0
        },
        credit: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: 0
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

export default model('chartAccountType', paymentReceiptSchema);
