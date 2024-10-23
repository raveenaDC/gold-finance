import { Schema, model, Types } from 'mongoose';

const goldLoanSchema = new Schema(
    {
        GlNo: String,
        purchaseDate: Date,
        goldRate: Types.Decimal128,
        companyGoldRate: Types.Decimal128,
        netWeight: Types.Decimal128,
        grossWeight: Types.Decimal128,
        stoneWeight: Types.Decimal128,
        interestRate: Types.Decimal128,
        itemId: { type: Schema.Types.ObjectId, ref: 'goldItem' },
        customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
        memberId: { type: Schema.Types.ObjectId, ref: 'member' },
        nomineeId: { type: Schema.Types.ObjectId, ref: 'customer' },
        insurance: Types.Decimal128,
        processingFee: Types.Decimal128,
        packingFee: Types.Decimal128,
        appraiser: Types.Decimal128,
        principleAmount: Types.Decimal128,
        amountPaid: Types.Decimal128,
        balanceAmount: Types.Decimal128,
        currentGoldValue: Types.Decimal128,
        profitOrLoss: Types.Decimal128,
        goldImage: {
            name: String,
            fileName: String,
            path: { type: String, default: '/cdn/images/user.png' },
            uploadedDate: Date,
        },
    },
    { timestamps: true }
);

export default model('goldLoan', goldLoanSchema);
