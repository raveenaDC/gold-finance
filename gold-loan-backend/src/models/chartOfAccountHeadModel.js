import { Schema, model, Types } from 'mongoose';

const charAccountSchema = new Schema(
    {
        accountName: String,
        category: String,
        subCategory: Date,
        description: {
            type: String,
            length: 1000
        },
        debit: {
            type: Number,
            default: 0
        },
        credit: {
            type: Number,
            default: 0
        },
        balance: {
            type: Number,
            default: 0
        },
        depreciationRateOne: {
            type: Number,
            default: 0
        },
        depreciationRateTwo: {
            type: Number,
            default: 0
        }
    },

    {
        timestamps: true,
    }
);

export default model('chartAccount', charAccountSchema);
