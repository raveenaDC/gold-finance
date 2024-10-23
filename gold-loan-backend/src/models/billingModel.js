import { Schema, model, Types } from 'mongoose';

const billingSchema = new Schema(
    {
        billNo: String,
        billDate: Date,
        gst: Types.Decimal128,
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'goldLoan' },
        // amountPaid: Types.Decimal128,
        // memberId: { type: Schema.Types.ObjectId, ref: 'customer' },

    },
    { timestamps: true }
);

export default model('billing', billingSchema);
