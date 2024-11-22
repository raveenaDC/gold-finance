import { Schema, model, Types } from 'mongoose';

const billingSchema = new Schema(
    {
        billNo: String,
        billDate: Date,
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'goldLoan' },
        // amountPaid: {
        //     type: Number,
        //     default: 0,
        // },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },

    },
    {
        timestamps: true,
        //id: false
    }
);

export default model('billing', billingSchema);
