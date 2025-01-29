import { Schema, model, Types } from 'mongoose';

const pledgeTransactionSchema = new Schema(
    {
        paidAmount: {
            type: Number,
            default: 0
        },
        paidInterest: {
            type: Number,
            default: 0
        },
        paidOtherCharges: {
            type: Number,
            default: 0
        },
        paidPrinciple: {
            type: Number,
            default: 0,
        },
        pledgeId: { type: Schema.Types.ObjectId, ref: 'PledgeTransaction' },
        bankId: { type: Schema.Types.ObjectId, ref: 'bankPledgeData' },

    },
    {
        timestamps: true,
        //id: false
    }
);

export default model('pledgeBillTransaction', pledgeTransactionSchema);
