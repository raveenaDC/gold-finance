import { Schema, model, Types } from 'mongoose';

const bankPledgeDetailsSchema = new Schema(
    {
        bankName: String,
        interestRate: {
            type: Number,
            default: 0
        },
        otherCharges: {
            type: Number,
            default: 0
        },
        duration: {
            type: Number,
            default: 0,
        },
        remark: String,

    },
    {
        timestamps: true,
        //id: false
    }
);

export default model('bankPledgeData', bankPledgeDetailsSchema);
