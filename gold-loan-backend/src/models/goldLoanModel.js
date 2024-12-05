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

const goldLoanSchema = new Schema(
    {
        glNo: String,
        purchaseDate: Date,
        voucherNo: String,
        goldRate: {
            type: Number,
            default: 0
        },
        companyGoldRate: {
            type: Number,
            default: 0
        },
        interestPercentage: {
            type: Number,
            default: 0
        },
        interestRate: {
            type: Number,
            default: 0
        },
        totalNetWeight: {
            type: Number,
            default: 0
        },
        interestMode: String,
        itemDetails: [itemDetailsSchema],
        customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },
        nomineeId: { type: Schema.Types.ObjectId, ref: 'customer' },
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
        currentGoldValue: {
            type: Number,
            default: 0,
        },
        profitOrLoss: {
            type: Number,
            default: 0,
        },
        goldImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
        isClosed: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
        id: false // Disable the `id` virtual field

    }
);

export default model('goldLoan', goldLoanSchema);
