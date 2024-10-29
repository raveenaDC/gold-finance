import { Schema, model, Types } from 'mongoose';

const goldLoanSchema = new Schema(
    {
        glNo: String,
        purchaseDate: Date,
        goldRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        companyGoldRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        netWeight: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        grossWeight: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        stoneWeight: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        interestRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        interestMode: String,
        itemId: { type: Schema.Types.ObjectId, ref: 'goldItem' },
        customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },
        nomineeId: { type: Schema.Types.ObjectId, ref: 'customer' },
        insurance: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        processingFee: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        packingFee: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        appraiser: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        principleAmount: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        amountPaid: {
            type: Types.Decimal128,
            default: 0,
            get: v => v ? parseFloat(v.toString()) : 0
        },
        balanceAmount: {
            type: Types.Decimal128,
            default: 0,
            get: v => v ? parseFloat(v.toString()) : 0
        },
        currentGoldValue: {
            type: Types.Decimal128,
            default: 0,
            get: v => v ? parseFloat(v.toString()) : 0
        },
        profitOrLoss: {
            type: Types.Decimal128,
            default: 0,
            get: v => v ? parseFloat(v.toString()) : 0
        },
        goldImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
    },
    {
        timestamps: true,
        toJSON: { getters: true },
        toObject: { getters: true }
    }
);

export default model('goldLoan', goldLoanSchema);
