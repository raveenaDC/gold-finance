import { Schema, model, Types } from 'mongoose';

const itemDetailsSchema = new Schema(
    {
        goldItem: { type: Schema.Types.ObjectId, ref: 'goldItem' },
        netWeight: {
            type: Number,
            default: 0
        },
        grossWeight: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        },
        // description: String,
        depreciation: {
            type: Number,
            default: 0
        },
        stoneWeight: {
            type: Number,
            default: 0
        }
    },
    { id: false } // Ensure no id field is added
);

const pledgeDetailsSchema = new Schema(
    {
        pledgeNumber: String,
        pledgeDate: Date,
        bankPledgeNumber: String,
        remarks: String,
        bankId: { type: Schema.Types.ObjectId, ref: 'bankPledgeData' },
        interestRate: {
            type: Number,
            default: 0
        },
        otherCharges: {
            type: Number,
            default: 0
        },
        totalPaidPrinciple: {
            type: Number,
            default: 0
        },
        totalPaidInterest: {
            type: Number,
            default: 0
        },
        dueDate: Date,
        principleAmount: {
            type: Number,
            default: 0
        },
        glNumber: [{ type: Schema.Types.ObjectId, ref: 'goldLoan' }],
        paymentMode: {
            type: String,
            default: "cash",
        },
        itemDetails: [itemDetailsSchema]

    },
    {
        timestamps: true,
        //id: false
    }
);

export default model('PledgeTransaction', pledgeDetailsSchema);
