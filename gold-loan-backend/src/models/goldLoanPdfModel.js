import { Schema, model, Types } from 'mongoose';

const loanDocumentSchema = new Schema(
    {
        goldLoanId: { type: Schema.Types.ObjectId, ref: 'goldLoan' },
        customerId: { type: Schema.Types.ObjectId, ref: 'customer' },
        document: {

            name: String,
            fileName: String,
            path: String,
            uploadedDate: Date,

        }
    },
    {
        timestamps: true,

    }
);

export default model('goldLoanDocument', loanDocumentSchema);
