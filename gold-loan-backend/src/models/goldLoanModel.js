import { Schema, model, Types } from 'mongoose';

const itemDetailsSchema = new Schema(
    {
        goldItem: { type: Schema.Types.ObjectId, ref: 'goldItem' },
        netWeight: {
            type: Types.Decimal128,
            get: v => (v ? parseFloat(v.toString()) : null)
        },
        grossWeight: {
            type: Types.Decimal128,
            get: v => (v ? parseFloat(v.toString()) : null)
        },
        quantity: {
            type: Types.Decimal128,
            get: v => (v ? parseFloat(v.toString()) : null)
        },
        description: String,
        depreciation: {
            type: Types.Decimal128,
            get: v => (v ? parseFloat(v.toString()) : null)
        },
        stoneWeight: {
            type: Types.Decimal128,
            get: v => (v ? parseFloat(v.toString()) : null)
        }
    },
    { id: false } // Ensure no id field is added
);

const goldLoanSchema = new Schema(
    {
        glNo: String,
        purchaseDate: String,
        voucherNo: String,
        goldRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        companyGoldRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        interestRate: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        interestMode: String,
        itemDetails: [itemDetailsSchema],
        customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },
        nomineeId: { type: Schema.Types.ObjectId, ref: 'customer' },
        insurance: {
            type: Types.Decimal128,
            get: v => v ? parseFloat(v.toString()) : null
        },
        paymentMode: {
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
        toObject: { getters: true },
        id: false // Disable the `id` virtual field

    }
);

export default model('goldLoan', goldLoanSchema);
