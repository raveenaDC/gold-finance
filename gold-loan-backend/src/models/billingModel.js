import { Schema, model, Types } from 'mongoose';

const billingSchema = new Schema(
    {
        billNo: String,
        billDate: Date,
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'goldLoan' },
        // amountPaid: {
        //     type: Types.Decimal128,
        //     get: v => v ? parseFloat(v.toString()) : null
        // },
        // memberId: { type: Schema.Types.ObjectId, ref: 'customer' },

    },
    {
        timestamps: true,
        // toJSON: { getters: true },
        // toObject: { getters: true },
        //id: false
    }
);

export default model('billing', billingSchema);
