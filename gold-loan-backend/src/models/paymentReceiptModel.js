import { Schema, model, Types } from 'mongoose';

const paymentReceiptSchema = new Schema(
    {
        accountName: String,
        description: {
            type: String,
            length: 1000
        },
        debit: {
            type: Number,
            default: 0
        },
        credit: {
            type: Number,
            default: 0
        },
        isPaymentType: {
            type: Boolean,
            default: 0
        },
        amountDate: Date,
        chartId: { type: Schema.Types.ObjectId, ref: 'chartAccount' },
        accountType: String,
        voucherNumber: String,

    },
    {
        timestamps: true,
    }
);

export default model('chartAccountType', paymentReceiptSchema);
